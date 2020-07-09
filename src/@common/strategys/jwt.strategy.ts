import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TokenService } from '../services/token.service'

export interface TokenJwt {
  id: number,
  email: string,
  person: object,
  client: object,
  roles: object,
  permissions: object,
  iat?: Date
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_KEY')
    });
  }

  async validate(token: TokenJwt) {
    await this.tokenService.validateToken(token);
    return token;
  }
}