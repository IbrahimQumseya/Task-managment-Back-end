import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ChatModule } from './chat/chat.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const webSocket = await NestFactory.create<NestExpressApplication>(AppModule);
  webSocket.useStaticAssets(join(__dirname, '..', 'static'));

  const config = new DocumentBuilder()
    .setTitle('Task-Management-back-end')
    .setDescription('REST-API-Task-management')
    .addTag('Task-Management')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = process.env.PORT;
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
  await webSocket.listen(3004);
  logger.log(`App listening on port ${port}`);
}
bootstrap();
