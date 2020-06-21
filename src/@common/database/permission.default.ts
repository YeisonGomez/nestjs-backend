import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { permission } from '../../entities/users/permission';

export class PermissionDatabaseDefault {

  constructor(
    @InjectRepository(permission, 'users') private readonly repository: Repository<permission>
  ) {
    this.create({ key: 'admin_users', name: 'Administrar usuarios' })
  }

  async create(_object){
    const _new = new permission(_object)
    const isExist = await this.repository.findOne({ where: { key: _object.key }})

    if(isExist)
      return 

    return this.repository.save(_new)
  }
}
