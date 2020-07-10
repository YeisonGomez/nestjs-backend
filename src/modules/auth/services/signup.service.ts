import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getManager } from "typeorm";

import { User } from "../../../entities/users/user.entity";
import { Language } from "../../../entities/users/language.entity";
import { Person } from "../../../entities/users/person.entity";
import { Client } from "../../../entities/users/client.entity";
import { TokenService } from "../../../@common/services/token.service";
import { Signup } from "../dto/signup.dto";
import { UserRole } from "src/entities/users/userRole.entity";
import { Role } from "src/entities/users/role.entity";
import { Roles } from "src/@common/constants/role.constant";

@Injectable()
export class SignUpService {
  constructor(
    @InjectRepository(User, 'users') private readonly userRepository: Repository<User>,
    @InjectRepository(Language, 'users') private readonly languageRepository: Repository<Language>,
    @InjectRepository(Person, 'users') private readonly personRepository: Repository<Person>,
    @InjectRepository(Client, 'users') private readonly clientRepository: Repository<Client>,
    @InjectRepository(Role, 'users') private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole, 'users') private readonly rolesRepository: Repository<UserRole>, 
    private readonly tokenService: TokenService,
  ){}

  async signup(body: Signup) {
    const isUser = await this.userRepository.findOne({
      select: ['id', 'state', 'email'],
      relations: ['person'],
      where: { email: body.email, state: 'active' },
    });

    if (isUser)
      return { error: 'EMAIL_IN_USE', detail: 'Ese correo electronico ya está siendo utilizado.' }

    await getManager('users').transaction(async entityManager => {
      const language = await this.languageRepository.findOne({ key: body.language })

      const user = await entityManager.save(this.userRepository.create({
        email: body.email,
        password: body.password
      }));

      const role = await this.roleRepository.findOne({ key: Roles.CLIENT })

      await entityManager.save(this.rolesRepository.create({
        role,
        user
      }))

      await entityManager.save(this.personRepository.create({
        name: body.name,
        lastname: body.lastname,
        phone: body.phone,
        user,
        language
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