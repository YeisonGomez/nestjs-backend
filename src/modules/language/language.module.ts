import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LanguageController } from './language.controller';
import { Language } from '../../entities/users/language.entity';
import { FindService } from './services/find.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language], 'users')
  ],
  controllers: [LanguageController],
  providers: [FindService],
})

export class LanguageModule { }
