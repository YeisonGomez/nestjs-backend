import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log("gaurds", roles);
    
    console.log(user);
    
    const hasRole = () => user.rols.some((role) => !!roles.find((item) => item === role));
    return user && user.rols && hasRole();
  }
}