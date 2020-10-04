import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../../entities/user/role.entity';
import { Roles } from '../constants/role.constant'

const ROLES = [
  { key: Roles.SUPERADMIN, name: 'Super administrador' },
  { key: Roles.ADMIN, name: 'Administrador' },
  { key: Roles.CLIENT, name: 'Cliente' }
]

export class RolDatabaseDefault {

  constructor(
    @InjectRepository(Role, 'user') 
    private readonly repository: Repository<Role>
  ) {
    ROLES.map(role => this.create(role))
  }

  async create(_object){
    const isExist = await this.repository.findOne({ where: { key: _object.key }})

    if(isExist)
      return

    const _new = this.repository.create(_object)

    return this.repository.save(_new)
  }
}
