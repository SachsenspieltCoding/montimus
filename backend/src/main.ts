import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  if (!process.env.JWT_SECRET || !process.env.COOKIE_SECRET) {
    throw new Error('JWT_SECRET and COOKIE_SECRET must be set in the environment');
  }

  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
