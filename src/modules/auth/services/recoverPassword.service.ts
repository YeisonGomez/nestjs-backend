import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import { User } from "../../../entities/users/user.entity";
import { ChangePassword } from "../dto/changePassword.dto";
import { States } from "../../../entities/enums/states.enum";

@Injectable()
export class RecoverPasswordService {
  constructor(
    @InjectRepository(User, 'users') private readonly userRepository: Repository<User>,
    @Inject('CryptoService') private cryptoService
  ){}

  async requestForgotPassword(email: string) {
    const user = await this.userRepository.findOne({ 
      select: ['id'],
      relations: ['person', 'person.language'],
      where: { email: email } 
    });

    if (!user)
      return { error: 'USER_NOT_EXIST', detail: 'El usuario no existe' }

    if (user.state === States.Inactive)
      return { error: 'USER_INACTIVE', detail: 'El usuario esta inactivo' }

    const checkCode = randomStringGenerator();
    await this.userRepository.update({ id: user.id }, { code: checkCode })

    return { success: 'OK', payload: { ...user.person, code: checkCode, lng: user.person.language.key } }
  }

  async changePassword(body: ChangePassword) {
    const user = await this.userRepository.findOne({ where: { code: body.code } });

    if (!user)
      return { error: 'CODE_ERROR', detail: 'El código no coincide con ningún usuario.' }

    if (user.state === States.Inactive)
      return { error: 'USER_INACTIVE', detail: 'El usuario esta inactivo.' }

    body.password = this.cryptoService.encrypt(body.password);
    await this.userRepository.update({ id: user.id }, { password: body.password, code: null })

    return { success: 'OK' }
  }
}