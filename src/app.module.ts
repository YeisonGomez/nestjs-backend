import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InstanceConfigService } from './@common/config/config.service';
import { CommonModule } from './@common/common.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LanguageModule } from './language/language.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(InstanceConfigService.orm_config.users),
    CommonModule,
    AuthModule,
    UserModule,
    LanguageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
