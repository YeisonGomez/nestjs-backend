import { Controller, Request, Get, Body, Put, UseGuards, UnauthorizedException,  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ResponseSuccess, ResponseError } from '../../@common/interfaces/response';
import { UpdateProfile } from './dto/updateProfile.dto';
import { Roles } from '../../@common/decorators/roles.decorator';
import { Permissions } from '../../@common/decorators/permissions.decorator';
import { FindService } from './services/find.service';
import { Roles as roles} from '../../@common/constants/role.constant'
import { Permissions as permissions } from '../../@common/constants/permission.constant'
import { RolesGuard } from '../../@common/guards/roles.guard';
import { PermissionGuard } from '../../@common/guards/permissions.guard';
import { PermissionsService } from './services/permissions.service';
import { ProfileService } from './services/profile.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly findService: FindService,
    private readonly permissionsService: PermissionsService,
    private readonly profileService: ProfileService
  ) { }

  @Get('/get-permissions')
  @UseGuards(AuthGuard('jwt'))
  async getPermissions(@Request() req): Promise<ResponseSuccess | ResponseError> {
    const permissions = await this.permissionsService.getPermissions(req.user.id);

    if(permissions)
      return { success: 'OK', payload: permissions }
      
    throw new UnauthorizedException({ error: 'UNAUTHORIZED' });
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req): Promise<ResponseSuccess | ResponseError> {
    return await this.profileService.getProfile(req.user.id);
  }

  @Put('/update')
  async profileUpdate(@Request() req, @Body() body: UpdateProfile): Promise<ResponseSuccess | ResponseError> {
    return await this.profileService.profileUpdate(req.user.id, body);
  }

  @Get('/clients-all')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionGuard)
  @Roles(roles.SUPERADMIN)
  @Permissions(permissions.ADMIN_USERS)
  async getClientsAll(): Promise<ResponseSuccess | ResponseError> {
    return {
      success: 'OK',
      payload: await this.findService.getClientsAll()
    }
  }
}
