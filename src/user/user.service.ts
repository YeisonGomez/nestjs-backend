import { Injectable, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { user } from '../entities/user';
import { person } from '../entities/person';
import { client } from '../entities/client';
import { language } from '../entities/language';
import { Update } from './dto/update';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(user, 'users') private readonly userRepository: Repository<user>,
    @InjectRepository(person, 'users') private readonly personRepository: Repository<person>,
    @InjectRepository(client, 'users') private readonly clientRepository: Repository<client>,
    @InjectRepository(language, 'users') private readonly languageRepository: Repository<language>,
  ) { }

  async getPermissions(id: number) {
    const client = await this.clientRepository.findOne({
      select: ['id', 'state'],
      where: { user: { id }, state: 'active' }
    })

    if(client)
      return ['client']

    return undefined
  }

  async getProfile(id: number) {
    const userValidate: any = await this.userRepository.createQueryBuilder('user')
    .select(['user.id', 'user.email'])
    .innerJoinAndSelect('user.person', 'person')
    .innerJoinAndSelect('person.language', 'language')
    .leftJoinAndSelect('user.client', 'client')
    .where("user.state = 'active' AND user.id = :id", { id })
    .getOne()
    
    if (!userValidate)
      return { error: 'USER_INACTIVE', detail: 'El usuario se encuentra inactivo.' }

    return userValidate;
  }

  async profileUpdate(id: number, body: Update) {
    const user = await this.userRepository.findOne({
      select: ['id'],
      join: {
        alias: 'user',
        innerJoinAndSelect: { person: 'user.person', client: 'user.client' }
      },
      where: { id }
    })

    if (!user)
      return { error: 'USER_INCORRECT', detail: 'No hay ningun usuario con ese parametro de busqueda.' }

    const newLanguage = await this.languageRepository.findOne({ key: body.language })

    await this.personRepository.update(user.person.id, {
      name: body.name,
      lastname: body.lastname,
      phone: body.phone,
      language: newLanguage
    });

    await this.clientRepository.update(user.client.id, {
      city: body.city,
      country: body.country
    });

    return { success: 'OK' }
  }
}