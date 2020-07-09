import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './@common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { LanguageModule } from './modules/language/language.module';
import { RolesGuard } from './@common/guards/roles.guard';
import { PermissionGuard } from './@common/guards/permissions.guard';
import appConfig from './@common/config/app.config';
import sendgridConfig from './@common/config/sendgrid.config';
import typeormConfig from './@common/config/typeorm.config';
import gcsConfig from './@common/config/gcs.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.example',
      load: [appConfig, sendgridConfig, typeormConfig, gcsConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => configService.get('typeorm.users'),
      name: 'users' 
    }),
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

export class AppModule { }
