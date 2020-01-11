import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const port = parseInt(process.env.PORT, 10) || 5000;
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port }
  });
  app.listen(() => console.log(`Microservice is listening on ${port}`));
}
bootstrap();
