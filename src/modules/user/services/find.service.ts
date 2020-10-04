import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../../entities/user/user.entity";
import { State } from "../../../entities/enums/states.enum";

@Injectable()
export class FindService {
  constructor(
    @InjectRepository(User, 'user') private readonly userRepository: Repository<User>
  ){}

  async getClientsAll() {
    const clients = this.userRepository.createQueryBuilder('user')
      .innerJoin('user.client', 'client')
      .where('user.state = :state', { state: State.Active })
      .getMany()

    return clients
  }
}