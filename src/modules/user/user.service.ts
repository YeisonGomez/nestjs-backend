import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateProfile } from './dto/updateProfile.dto';
import { User } from '../../entities/users/user.entity';
import { Person } from '../../entities/users/person.entity';
import { Client } from '../../entities/users/client.entity';
import { Language } from '../../entities/users/language.entity';
import { UserRole } from '../../entities/users/userRole.entity';
import { UserPermission } from '../../entities/users/userPermission.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User, 'users') private readonly userRepository: Repository<User>,
    @InjectRepository(Person, 'users') private readonly personRepository: Repository<Person>,
    @InjectRepository(Client, 'users') private readonly clientRepository: Repository<Client>,
    @InjectRepository(Language, 'users') private readonly languageRepository: Repository<Language>,
    @InjectRepository(UserRole, 'users') private readonly userRolRepository: Repository<UserRole>,
    @InjectRepository(UserPermission, 'users') private readonly userPermissionRepository: Repository<UserPermission>
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

  async profileUpdate(id: number, body: UpdateProfile) {
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