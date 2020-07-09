import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../@common/strategys/jwt.strategy';
import { User } from '../../entities/users/user.entity';
import { Person } from '../../entities/users/person.entity';
import { Client } from '../../entities/users/client.entity';
import { Language } from '../../entities/users/language.entity';
import { UserRole } from '../../entities/users/userRole.entity';
import { UserPermission } from '../../entities/users/userPermission.entity';
import { UserService } from '../user/user.service';
import { SignUpService } from './services/signup.service';
import { LoginService } from './services/login.service';
import { RecoverPasswordService } from './services/recoverPassword.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      Person, 
      Client, 
      Language, 
      UserRole, 
      UserPermission
    ], 'users'),
    JwtModule.registerAsync({ 
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_KEY'),
        signOptions: { expiresIn: '15d' } //enviroment
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    SignUpService,
    LoginService,
    RecoverPasswordService, 
    UserService
  ]
})
export class AuthModule { }
