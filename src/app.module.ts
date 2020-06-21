import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { InstanceConfigService } from './@common/config/config.service';
import { CommonModule } from './@common/common.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LanguageModule } from './language/language.module';
import { RolesGuard } from './@common/guards/roles.guard';
import { PermissionGuard } from './@common/guards/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(InstanceConfigService.orm_config.users),
    CommonModule,
    AuthModule,
    UserModule,
    LanguageModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {
}
