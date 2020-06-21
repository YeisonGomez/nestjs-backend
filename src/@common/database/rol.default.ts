import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { rol } from '../../entities/users/rol';

export class RolDatabaseDefault {

  constructor(
    @InjectRepository(rol, 'users') private readonly repository: Repository<rol>
  ) {
    this.create({ key: 'superadmin', name: 'Super administrador' })
    this.create({ key: 'admin', name: 'Administrador' })
  }

  async create(_object){
    const _new = new rol(_object)
    const isExist = await this.repository.findOne({ where: { key: _object.key }})

    if(isExist)
      return 

    return this.repository.save(_new)
  }
}
