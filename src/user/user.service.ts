import { Injectable, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Update } from './dto/update';
import { user } from '../entities/users/user';
import { person } from '../entities/users/person';
import { client } from '../entities/users/client';
import { language } from '../entities/users/language';
import { userRol } from '../entities/users/userRol';
import { userPermission } from '../entities/users/userPermission';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(user, 'users') private readonly userRepository: Repository<user>,
    @InjectRepository(person, 'users') private readonly personRepository: Repository<person>,
    @InjectRepository(client, 'users') private readonly clientRepository: Repository<client>,
    @InjectRepository(language, 'users') private readonly languageRepository: Repository<language>,
    @InjectRepository(userRol, 'users') private readonly userRolRepository: Repository<userRol>,
    @InjectRepository(userPermission, 'users') private readonly userPermissionRepository: Repository<userPermission>
  ) { }

  async getPermissions(id: number) {
    const client = await this.clientRepository.findOne({
      select: ['id', 'state'],
      where: { user: { id } }
    })

    if(client)
      return { rols: ['client'], state: client.state }

    let rols: any = await this.userRolRepository.find({
      relations: ['rol'],
      where: { user: { id }, state: 'active' }
    })
    rols = rols.map(item => ({ ...item.rol }))
    
    let permissions: any = await this.userPermissionRepository.find({
      relations: ['permission'],
      where: { user: { id }, state: 'active' }
    })
    permissions = permissions.map(item => ({ ...item.permission }))

    return { rols, permissions }
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

  async getClientsAll() {
    return "No se porque entro"
  }
}