import './common/polyfill';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnv } from './config/envLoader'
import { HttpExceptionFilter } from './common/filters/http-exception.filter';


loadEnv();

// Polyfill for crypto
import * as crypto from 'crypto';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
(global as any).crypto = crypto;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new HttpExceptionFilter());

  app.useGlobalInterceptors(
    new TransformInterceptor
  )

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('The Sole Edit')
    .setDescription('A simple ecommerce')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
