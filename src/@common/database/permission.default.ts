import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from '../../entities/user/permission.entity';
import { Permissions } from '../constants/permission.constant'

const PERMISSIONS = [
  { key: Permissions.ADMIN_USERS, name: 'Administrar usuarios' }
]

export class PermissionDatabaseDefault {
  constructor(
    @InjectRepository(Permission, 'user') 
    private readonly repository: Repository<Permission>
  ) {
    PERMISSIONS.map(permission => this.create(permission))
  }

  async create(_object){
    const isExist = await this.repository.findOne({ where: { key: _object.key }})
    
    if(isExist)
      return 
    
    const _new = this.repository.create(_object)

    return this.repository.save(_new)
  }
}
