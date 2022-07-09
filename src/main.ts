import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger as Pino } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      methods: ['GET', 'POST', 'PUT'],
      allowedHeaders: ['X-Access-Token', 'Content-Type'],
      origin: true,
    },
  });
  app.useLogger(app.get(Pino));
  await app.listen(3000);
}
bootstrap();
