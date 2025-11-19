import cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as yaml from 'yaml';
import * as fs from 'fs';

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

  const config = new DocumentBuilder()
    .setTitle('Snipet')
    .setDescription('The Snipet API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'access-token',
    )
    .build();


  const document = SwaggerModule.createDocument(app, config);
  const yamlDocument = yaml.stringify(document);
  fs.writeFileSync('./swagger.yaml', yamlDocument);

  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  await app.listen(env.APP_PORT);
}

bootstrap();
