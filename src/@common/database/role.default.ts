import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../../entities/users/role.entity';

const ROLES = [
  { key: 'superadmin', name: 'Super administrador' },
  { key: 'admin', name: 'Administrador' },
  { key: 'client', name: 'Cliente' },
  { key: 'general', name: 'General' }
]

export class RolDatabaseDefault {

  constructor(
    @InjectRepository(Role, 'users') 
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
