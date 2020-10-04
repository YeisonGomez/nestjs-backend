import { Controller, Get } from '@nestjs/common';

import { ResponseError, ResponseSuccess } from '../../@common/interfaces/response';
import { FindService } from './services/find.service';

@Controller('language')
export class LanguageController {

  constructor(
    private readonly findService: FindService
  ) { }

  @Get('/all')
  async getLanguageAll(): Promise<ResponseSuccess | ResponseError> {
    return { 
      success: 'OK',
      payload: this.findService.findAll()
    }
  }
}
