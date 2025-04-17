import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as express from 'express';
import { join } from 'path';
import * as bodyParser from 'body-parser';

import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // console.log("/uploads", join(__dirname, '..', '..', 'uploads'));
  app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000', // Autorise Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Autorise les cookies et l'authentification
  });

  app.use(bodyParser.json({ limit: '10mb' })); // Ici, la limite est augmentée à 10 Mo
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
