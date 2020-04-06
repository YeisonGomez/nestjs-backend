import { Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { language } from '../entities/language';

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
