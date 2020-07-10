import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../entities/users/user.entity";
import { States } from "../../entities/enums/states.enum";
import { TokenJwt } from "../strategys/jwt.strategy";
import { PermissionsService } from "../../modules/user/services/permissions.service";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User, 'users') private readonly userRepository: Repository<User>,
    private readonly permissionsService: PermissionsService
  ){}

  serializeToken = async (email) => {
    const user = await this.userRepository.createQueryBuilder('user')
      .select(['user.id', 'user.email'])
      .innerJoinAndSelect('user.person', 'person')
      .innerJoinAndSelect('user.client', 'client')
      .leftJoinAndSelect('user.roles', 'roles', 'roles.state = :stat', { stat: States.Active })
      .leftJoinAndSelect('roles.role', 'role', 'role.state = :stat', { stat: States.Active })
      .leftJoinAndSelect('user.permissions', 'permissions', 'permissions.state = :stat', { stat: States.Active })
      .leftJoinAndSelect('permissions.permission', 'permission', 'permission.state = :stat', { stat: States.Active })
      .where('user.email = :email AND user.state = :state', { email, state: States.Active })
      .getOne()

    const token: TokenJwt = {
      id: user.id,
      email: user.email,
      client: user.client,
      person: user.person,
    }

    return token
  }

  async validateToken(token: TokenJwt): Promise<any> {
    const { email, id } = token
    
    const user = await this.userRepository.findOne({ id, email, state: States.Active })
    if(!user){
      throw new UnauthorizedException('invalid or expire token')
    }

    const { permissions, roles } = await this.permissionsService.getPermissions(user.id)

    return {...token, permissions, roles }
  }
}