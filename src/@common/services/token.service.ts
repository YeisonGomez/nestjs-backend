import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../entities/users/user.entity";
import { States } from "src/entities/enums/states.enum";
import { TokenJwt } from "../strategys/jwt.strategy";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User, 'users') private readonly userRepository: Repository<User>
  ){}

  serializeToken = async (email) => {
    /*const user = await this.userRepository.findOne({
      select: ['id', 'email'],
      relations: ['person', 'client'],
      where: { email }
    })*/

    const user = await this.userRepository.createQueryBuilder('user')
      .select(['user.id', 'user.email'])
      .innerJoinAndSelect('user.person', 'person')
      .innerJoinAndSelect('user.client', 'client')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .where('user.email = :email AND user.state = :state', { email, state: States.Active })
      .getOne()

    const token: TokenJwt = {
      id: user.id,
      email: user.email,
      client: user.client,
      person: user.person,
      roles: user.roles,
      permissions: user.permissions,
    }

    return token
  }

  async validateToken(token: any): Promise<any> {
    //let payload: any = this.jwtService.decode(token);
    console.log(token);
    
    /*if (payload) {
      const user = await this.userRepository.createQueryBuilder('user')
        .select(['user.id', 'user.email'])
        .innerJoinAndSelect('user.person', 'person')
        .where('user.email = :email', { email: payload.email })
        .getOne()

      const permissionsAndRols = await this.userService.getPermissions(user.id)

      return { ...user, ...permissionsAndRols }
    }

    return false;*/
  }
}