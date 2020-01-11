import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  await app.listen(5000);
}
bootstrap();