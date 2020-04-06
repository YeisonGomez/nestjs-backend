import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { APP_URL_PREFIX, PORT } = app.get("ConfigService").envConfig;
  const { app: configService } = app.get("ConfigService")

  app.setGlobalPrefix(APP_URL_PREFIX);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  await app.listen(PORT || "4200");
  console.log(`Server running on ${configService.appHostServer}/${APP_URL_PREFIX}`);
}
bootstrap();
