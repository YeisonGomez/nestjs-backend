import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { User } from '../../entities/user/user.entity';
import { Person } from '../../entities/user/person.entity';
import { Client } from '../../entities/user/client.entity';
import { Language } from '../../entities/user/language.entity';
import { UserRole } from '../../entities/user/userRole.entity';
import { UserPermission } from '../../entities/user/userPermission.entity';
import { FindService } from './services/find.service';
import { PermissionsService } from './services/permissions.service';
import { ProfileService } from './services/profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Person, Client, Language, UserRole, UserPermission], 'user')
  ],
  controllers: [UserController],
  providers: [
    FindService,
    PermissionsService,
    ProfileService
  ],
  exports: [PermissionsService]
})
export class UserModule {
}
