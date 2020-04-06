import { Injectable, Inject, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as moment from 'moment';

import { person } from '../entities/person';
import { client } from '../entities/client';
import { user } from '../entities/user';
import { LoginDto } from './dto/login.dto';
import { signup } from './dto/signup';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { language } from '../entities/language';

@Injectable()
export class AuthService {

  constructor(
    @Inject('CryptoService') private readonly cryptoService,
    @InjectRepository(user, 'users') private readonly userRepository: Repository<user>,
    @InjectRepository(person, 'users') private readonly personRepository: Repository<person>,
    @InjectRepository(client, 'users') private readonly clientRepository: Repository<client>,
    @InjectRepository(language, 'users') private readonly languageRepository: Repository<language>,
    private readonly jwtService: JwtService
  ) { }

  async login(body: LoginDto) {
    const user = await this.userRepository.findOne({ select: ["id", "email", "state"], relations: ["client"], where: body });

    if (!user)
      return { error: "USER_NOT_EXIST", detail: "Tu correo electronico o contraseña no son válidos." }
    else if(!user.client)
      return { error: "IS_NOT_CLIENT", detail: "Este usuario no es un cliente." }
    else if(user.client.state !== 'active')
      return { error: "CLIENT_INACTIVE", detail: "Cliente inactivo." }
    else if (user.state === 'inactive')
      return { error: "USER_INACTIVE", detail: "Usuario inactivo." }

    return await this.getStructureToken(user.email);
  }

  async signup(body: signup) {
    const isUser = await this.userRepository.findOne({
      select: ['id', 'state', 'email'],
      relations: ['person'],
      where: { email: body.email, state: 'active' },
    });

    if (isUser)
      return { error: 'EMAIL_IN_USE', detail: 'Ese correo electronico ya está siendo utilizado.' }

    await getManager('users').transaction(async entityManager => {
      const language = await this.languageRepository.findOne({ key: body.language })

      const user = await entityManager.save(await this.userRepository.create({
        email: body.email,
        password: body.password,
        state: 'active'
      }));

      await entityManager.save(await this.personRepository.create({
        name: body.name,
        lastname: body.lastname,
        phone: body.phone,
        user,
        language
      }));

      await entityManager.save(await this.clientRepository.create({
        state: 'paid_pending',
        city: body.city,
        country: body.country,
        user: { id: user.id }
      }));
    });

    return await this.getStructureToken(body.email);
  }

  async getStructureToken(email) {
    return await this.userRepository.findOne({
      select: ['id', 'email'],
      relations: ['person', 'client'],
      where: { email }
    })
  }

  async requestForgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });

    if (!user)
      return { error: 'USER_NOT_EXIST', detail: 'El usuario no existe' }

    if (user.state === 'inactive')
      return { error: 'USER_INACTIVE', detail: 'El usuario esta inactivo' }

    const person = await this.userRepository.findOne({
      select: ['id'],
      relations: ['person', 'person.language'],
      where: { email }
    })

    const checkCode = randomStringGenerator();
    await this.userRepository.update({ id: user.id }, { code: checkCode })

    return { success: 'OK', payload: { code: checkCode, name: person.person.name, lastname: person.person.lastname, lng: person.person.language.key } }
  }

  async changePassword(body: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { code: body.code } });

    if (!user)
      return { error: 'CODE_ERROR', detail: 'El código no coincide con ningún usuario.' }

    if (user.state === 'inactive')
      return { error: 'USER_INACTIVE', detail: 'El usuario esta inactivo.' }

    body.password = this.cryptoService.encrypt(body.password);

    await this.userRepository.update({ id: user.id }, { password: body.password, code: null })

    return { success: 'OK' }
  }

  async validateUser(token: string): Promise<any> {
    let payload: any = this.jwtService.decode(token);
    if (payload) {
      const user = await this.userRepository.createQueryBuilder('user')
        .select(['user.id', 'user.email'])
        .innerJoinAndSelect('user.person', 'person')
        .where('user.email = :email', { email: payload.email })
        .getOne()

      //const permissions = await this.userService.getPermissions(user.id)

      return { ...user }
    }

    return false;
  }
}