import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { language } from '../entities/users/language';

@Module({
  imports: [
    TypeOrmModule.forFeature([language], 'users')
  ],
  controllers: [LanguageController],
  providers: [LanguageService ],
  exports: [TypeOrmModule]
})
export class LanguageModule {
}
