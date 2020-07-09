import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../entities/users/user.entity';
import { Person } from '../../entities/users/person.entity';
import { Client } from '../../entities/users/client.entity';
import { Language } from '../../entities/users/language.entity';
import { UserRole } from '../../entities/users/userRole.entity';
import { UserPermission } from '../../entities/users/userPermission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Person, Client, Language, UserRole, UserPermission], 'users')
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {
}
