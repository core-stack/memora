import "./tracing";
import "./utils/aux";

import cookieParser from "cookie-parser";
import * as fs from "fs";
import * as yaml from "yaml";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";

import { AppModule } from "./app.module";
import { env } from "./env";
import { ErrorsInterceptor } from "./interceptors/error.interceptor";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: env.CORS_ORIGINS, // ou "*"
    methods: env.CORS_METHODS,
    allowedHeaders: env.CORS_HEADERS,
    credentials: env.CORS_CREDENTIALS
  });

  const config = new DocumentBuilder()
    .setTitle("Snipet")
    .setDescription("The Snipet API description")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT", description: "Enter JWT token" },
      "access-token"
    )
    .build();


  const document = SwaggerModule.createDocument(app, config);

  const yamlDocument = yaml.stringify(document);
  fs.writeFileSync("./swagger.yaml", yamlDocument);

  app.use("/scalar", apiReference({ content: document }));
  SwaggerModule.setup("swagger", app, document);

  app.use(cookieParser());
  await app.listen(env.APP_PORT);
}

bootstrap();
