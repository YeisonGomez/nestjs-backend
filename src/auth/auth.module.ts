import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStrategy } from '../@common/strategys/http.strategy';
import { user } from '../entities/users/user';
import { person } from '../entities/users/person';
import { client } from '../entities/users/client';
import { language } from '../entities/users/language';
import { UserService } from '../user/user.service';
import { userRol } from '../entities/users/userRol';
import { userPermission } from '../entities/users/userPermission';

@Module({
  imports: [
    JwtModule.register({ secret: 'davidivas', signOptions: { expiresIn: '15d' } }),
    TypeOrmModule.forFeature([user, person, client, language, userRol, userPermission], 'users'),
  ],
  controllers: [AuthController],
  providers: [AuthService, HttpStrategy, UserService]
})
export class AuthModule { }
