import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { language } from '../../entities/users/language';

export class LanguageDatabaseDefault {

  constructor(
    @InjectRepository(language, 'users') private readonly repository: Repository<language>
  ) {
    this.create({ key: 'es', name: 'Español' })
    this.create({ key: 'en', name: 'Ingles' })
  }

  async create(_object){
    const _new = new language()
    _new.key = _object.key
    _new.name = _object.name

    const isExist = await this.repository.findOne({ where: { key: _object.key }})

    if(isExist)
      return 

    return this.repository.save(_new)
  }
}
