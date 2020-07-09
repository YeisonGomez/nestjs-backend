import { Controller, Get } from '@nestjs/common';

import { FindService } from './services/find.service';

@Controller('language')
export class LanguageController {

  constructor(
    private readonly findService: FindService
  ) { }

  @Get('/all')
  async getLanguageAll() {
    return this.findService.findAll();
  }
}
