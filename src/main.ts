import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger as Pino } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Pino));
  await app.listen(3000);
}
bootstrap();
