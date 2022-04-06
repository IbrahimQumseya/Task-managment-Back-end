import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const cookieSession = require('cookie-session');
import { TransformInterceptor } from './transform.interceptor';
import * as cors from 'cors';
import * as fs from 'fs';
import * as passport from 'passport';
require('./auth/3rdauth/google/passport');

async function bootstrap() {
  const consoleLogger = new Logger();
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Task-Management-back-end')
    .setDescription('REST-API-Task-management')
    .addTag('Task-Management')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  app.use(
    cookieSession({
      name: 'session',
      keys: ['lama'],
      maxAge: 24 * 60 * 60 * 100,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(
    cors({
      origin: 'http://localhost:3000',
      methods: 'GET,POST,PUT,DELETE',
      credentials: true,
    }),
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = process.env.PORT;
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);

  consoleLogger.log(`App listening on port ${port}`);
}
bootstrap();
