import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { user } from '../entities/users/user';
import { person } from '../entities/users/person';
import { client } from '../entities/users/client';
import { language } from '../entities/users/language';
import { userRol } from '../entities/users/userRol';
import { userPermission } from '../entities/users/userPermission';

@Module({
  imports: [
    TypeOrmModule.forFeature([user, person, client, language, userRol, userPermission], 'users')
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {
}
