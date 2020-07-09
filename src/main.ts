import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService)
  const { appPort, appHostServer, appPrefix } = configService.get('app')

  app.setGlobalPrefix(appPrefix);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(appPort || "4200");

  console.log(`Server running on ${appHostServer}/${appPrefix}`);
}
bootstrap();
