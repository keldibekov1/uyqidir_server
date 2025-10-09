import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const uploadDirs = [
    join(__dirname, '..', 'uploads'),
    join(__dirname, '..', 'uploads', 'temp'),
    join(__dirname, '..', 'uploads', 'final'),
  ];

  for (const dir of uploadDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      Logger.log(`📁 Created folder: ${dir}`);
    }
  }
  app.enableCors();
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Uyqidir API')
    .setDescription('Uyqidir uchun')
    .setVersion('1.0')
    .addSecurityRequirements('bearer', ['bearer'])
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`🚀 Server run on port ${process.env.PORT ?? 3000}`, 'Bootstrap');
}

bootstrap();
