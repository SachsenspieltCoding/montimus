import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  if (!process.env.JWT_SECRET || !process.env.COOKIE_SECRET) {
    throw new Error('JWT_SECRET and COOKIE_SECRET must be set in the environment');
  }

  const packageJson = require('../../package.json');

  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Montimus API')
    .setDescription('The Montimus API description')
    .setVersion(packageJson.version || '0.0.0')
    .addTag('Auth', 'Authentication and authorization')
    .addTag('Monitoring', 'Monitoring and metrics')
    .addTag('Users', 'Users and permissions')
    .addBearerAuth({ type: 'apiKey', scheme: 'bearer', bearerFormat: 'JWT' })
    .addCookieAuth('MONTIMUS_SESSION_TOKEN')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Montimus API Docs',
  });

  await app.listen(3000);
}

bootstrap();
