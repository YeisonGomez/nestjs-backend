import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../../entities/users/user.entity";
import { States } from "../../../entities/enums/states.enum";
import { Roles } from "../../../@common/constants/role.constant";

@Injectable()
export class FindService {
  constructor(
    @InjectRepository(User, 'users') private readonly userRepository: Repository<User>
  ){}

  async getClientsAll() {
    const clients = this.userRepository.createQueryBuilder('user')
      .innerJoin('user.roles', 'roles', 'roles.state = :stat', { stat: States.Active })
      .innerJoin('roles.role', 'role', 'role.stat = :stat AND role.key = :rol', { stat: States.Active, rol: Roles.CLIENT })
      .where('user.state = :state', { state: States.Active })
      .getMany()
    return clients
  }
}