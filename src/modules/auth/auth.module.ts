import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { JwtStrategy } from '../../@common/strategys/jwt.strategy';
import { AuthController } from './auth.controller';
import { User } from '../../entities/user/user.entity';
import { Person } from '../../entities/user/person.entity';
import { Client } from '../../entities/user/client.entity';
import { Language } from '../../entities/user/language.entity';
import { UserRole } from '../../entities/user/userRole.entity';
import { UserPermission } from '../../entities/user/userPermission.entity';
import { Role } from '../../entities/user/role.entity';
import { SignUpService } from './services/signup.service';
import { LoginService } from './services/login.service';
import { TokenService } from './services/token.service';
import { RecoverPasswordService } from './services/recoverPassword.service';
import { PermissionsService } from '../user/services/permissions.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      Person, 
      Client, 
      Language, 
      UserRole, 
      Role,
      UserPermission
    ], 'user'),
    JwtModule.registerAsync({ 
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_KEY'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRE') }
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    SignUpService,
    LoginService,
    RecoverPasswordService, 
    TokenService,
    PermissionsService
  ]
})
export class AuthModule { }
