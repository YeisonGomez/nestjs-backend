import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { user } from '../entities/user';
import { person } from '../entities/person';
import { client } from '../entities/client';
import { language } from '../entities/language';

@Module({
  imports: [
    TypeOrmModule.forFeature([user, person, client, language], 'users')
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {
}
