import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Language } from '../../entities/user/language.entity';
import { Languages } from '../constants/language.constant'

const LANGUAGES = [
  { key: Languages.SPANISH, name: 'Español' },
  { key: Languages.ENGLISH, name: 'Ingles' }
]

export class LanguageDatabaseDefault {
  constructor(
    @InjectRepository(Language, 'user') 
    private readonly repository: Repository<Language>
  ) {
    LANGUAGES.map(language => this.create(language))
  }

  async create(_object){
    const isExist = await this.repository.findOne({ where: { key: _object.key }})

    if(isExist)
      return 

    const _new = this.repository.create(_object)

    return this.repository.save(_new)
  }
}
