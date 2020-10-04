import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LanguageController } from './language.controller';
import { Language } from '../../entities/user/language.entity';
import { FindService } from './services/find.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language], 'user')
  ],
  controllers: [LanguageController],
  providers: [FindService],
})

export class LanguageModule { }
