import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common'; // Logger ajouté
import * as express from 'express';
import { Request, Response } from 'express'; // Ajouté pour le typage
import { join } from 'path';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser()); // <--- AJOUTÉ/ASSURÉ ICI
  const logger = new Logger('Bootstrap'); // Logger instance

  // Configuration de la Spécification OpenAPI (identique à avant)
  const config = new DocumentBuilder()
    .setTitle('BlogHub API')
    .setDescription('API pour la plateforme BlogHub')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // 1. Servir la spécification OpenAPI en tant que JSON
  app.use('/api-spec.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(document));
  });

  // 2. Servir la documentation Scalar sur /api-docs
  app.use('/api-docs', (_req: Request, res: Response) => {
    const scalarHtml = `
      <!doctype html>
      <html>
      <head>
        <title>BlogHub API Documentation - Scalar</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { margin: 0; }
        </style>
      </head>
      <body>
        <script
          id="api-reference"
          data-url="/api-spec.json"  // Pointeur vers notre spec JSON
          data-proxy-url="https://api.scalar.com/request-proxy" // Proxy optionnel mais recommandé par Scalar
        ></script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.send(scalarHtml);
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(cookieParser());
  app.enableCors({
    origin: 'https://bloghub-vdm6.onrender.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  // Logs améliorés
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(
    `OpenAPI specification (JSON) available at: http://localhost:${port}/api-spec.json`,
  );
  logger.log(
    `Scalar API Documentation available at: http://localhost:${port}/api-docs`,
  );
}
bootstrap();
