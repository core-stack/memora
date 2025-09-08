import 'dotenv/config';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: env.CORS_ORIGINS, // ou "*"
    methods: env.CORS_METHODS,
    allowedHeaders: env.CORS_HEADERS,
    credentials: env.CORS_CREDENTIALS,
  });
  await app.listen(env.APP_PORT);
}
bootstrap();
