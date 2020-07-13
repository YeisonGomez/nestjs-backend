import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'

import { AppService } from './app.service';
import Multer from './@common/multer/multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/file')
  @UseInterceptors(FileInterceptor('image', Multer.storageGCS('image')))
  uploadFile(@UploadedFile() file){
    console.log(file)
  }
}
