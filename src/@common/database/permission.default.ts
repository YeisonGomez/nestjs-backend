import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from '../../entities/users/permission.entity';

const PERMISSIONS = [
  { key: 'admin_users', name: 'Administrar usuarios' }
]

export class PermissionDatabaseDefault {
  constructor(
    @InjectRepository(Permission, 'users') 
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
