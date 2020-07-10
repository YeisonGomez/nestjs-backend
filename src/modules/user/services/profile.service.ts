import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../../entities/users/user.entity";
import { UpdateProfile } from "../dto/updateProfile.dto";
import { Language } from "src/entities/users/language.entity";
import { Person } from "src/entities/users/person.entity";
import { Client } from "src/entities/users/client.entity";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User, 'users') private readonly userRepository: Repository<User>,
    @InjectRepository(Language, 'users') private readonly languageRepository: Repository<Language>,
    @InjectRepository(Person, 'users') private readonly personRepository: Repository<Person>,
    @InjectRepository(Client, 'users') private readonly clientRepository: Repository<Client>
  ){}

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

}