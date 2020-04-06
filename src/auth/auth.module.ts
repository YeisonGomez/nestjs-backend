import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStrategy } from '../@common/strategys/http.strategy';
import { user } from '../entities/user';
import { person } from '../entities/person';
import { client } from '../entities/client';
import { language } from '../entities/language';

@Module({
  imports: [
    JwtModule.register({ secret: 'davidivas', signOptions: { expiresIn: '15d' } }),
    TypeOrmModule.forFeature([user, person, client, language], 'users'),
  ],
  controllers: [AuthController],
  providers: [AuthService, HttpStrategy]
})
export class AuthModule { }
