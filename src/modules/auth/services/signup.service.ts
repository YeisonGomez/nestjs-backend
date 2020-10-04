import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getManager } from "typeorm";

import { User } from "../../../entities/user/user.entity";
import { Language } from "../../../entities/user/language.entity";
import { Person } from "../../../entities/user/person.entity";
import { Client } from "../../../entities/user/client.entity";
import { TokenService } from "./token.service";
import { SignupDTO } from "../dto/signup.dto";

@Injectable()
export class SignUpService {
  constructor(
    @InjectRepository(User, 'user') private readonly userRepository: Repository<User>,
    @InjectRepository(Language, 'user') private readonly languageRepository: Repository<Language>,
    @InjectRepository(Person, 'user') private readonly personRepository: Repository<Person>,
    @InjectRepository(Client, 'user') private readonly clientRepository: Repository<Client>,
    private readonly tokenService: TokenService,
  ){}

  async signup(body: SignupDTO) {
    const isUser = await this.userRepository.findOne({
      select: ['id', 'state', 'email'],
      relations: ['person'],
      where: { email: body.email, state: 'active' },
    });

    if (isUser)
      return { error: 'EMAIL_IN_USE', detail: 'Ese correo electronico ya está siendo utilizado.' }

    await getManager('user').transaction(async entityManager => {
      const language = await this.languageRepository.findOne({ key: body.language })

      const user = await entityManager.save(this.userRepository.create({
        email: body.email,
        password: body.password, 
        language
      }));

      await entityManager.save(this.personRepository.create({
        name: body.name,
        lastname: body.lastname,
        phone: body.phone,
        user
      }));

      await entityManager.save(this.clientRepository.create({
        city: body.city,
        country: body.country,
        user: { id: user.id }
      }));
    });

    return await this.tokenService.serializeToken(body.email);
  }
}