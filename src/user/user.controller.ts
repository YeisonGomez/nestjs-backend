import { Controller, Request, Get, Body, Put, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { Update } from './dto/update';
import { Roles } from '../@common/decorators/roles.decorator';
import { Permissions } from '../@common/decorators/permissions.decorator';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Get('/get-permissions')
  @UseGuards(AuthGuard('bearer'))
  async getPermissions(@Request() req) {
    const permissions = await this.userService.getPermissions(req.user.id);

    if(permissions)
      return { success: 'OK', payload: permissions }
      
    throw new UnauthorizedException({ error: 'UNAUTHORIZED' });
  }

  @Get('/profile')
  @UseGuards(AuthGuard('bearer'))
  async getProfile(@Request() req) {
    return await this.userService.getProfile(req.user.id);
  }

  @Put('/update')
  @UseGuards(AuthGuard('bearer'))
  async profileUpdate(@Request() req, @Body() body: Update) {
    return await this.userService.profileUpdate(req.user.id, body);
  }

  @Get('/clients-all')
  @Roles('admin')
  @Permissions('admin_permissions')
  @UseGuards(AuthGuard('bearer'))
  async getClientsAll() {
    return await this.userService.getClientsAll();
  }
}
