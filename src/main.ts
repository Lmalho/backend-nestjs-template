import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger as NestLogger } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

export const OpenApiOptions = {
  info: {
    title: 'NestJs Template API',
    description: 'This template API can be used to create jobs',
    version: '0.0.0-development',
  },
};

let app: INestApplication;

/**
 * Bootstraps the HTTP server.
 */
async function bootstrapHttpServer() {
  app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  app.useLogger(app.get(Logger));

  const { title, description, version } = OpenApiOptions.info;

  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(title)
        .setDescription(description)
        .setVersion(version)
        .build(),
    ),
  );

  const logger = new NestLogger('bootstrapHttpServer');
  logger.log(`App listening at http://0.0.0.0:${process.env.API_PORT}`);

  await app.listen(process.env.API_PORT);
}

bootstrapHttpServer();
