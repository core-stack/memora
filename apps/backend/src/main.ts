import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { env } from './env';
import { ErrorsInterceptor } from './interceptors/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ErrorsInterceptor());
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
