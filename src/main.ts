import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const OpenApiOptions = {
  info: {
    title: 'Reedsy Challenge API',
    description:
      'The Reedsy Challenge API can be used to create import and export jobs',
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

  console.log(`App listening at port ${process.env.API_PORT}`);

  await app.listen(process.env.API_PORT);
}

bootstrapHttpServer();
