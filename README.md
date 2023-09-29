# Backend NestJS Template

This project is a [NestJS](https://github.com/nestjs/nest) API template to use with a MongoDB database.

The aim is to offer a set of solid features and architecture to quickly start a new project.

## How to install and run

### Prerequisites

Install

- [yarn](https://yarnpkg.com)
- [Node.js](https://nodejs.org)
- [NestJs](https://nestjs.com/)
- [Docker](https://www.docker.com/)
- [Node Version Manager](https://github.com/nvm-sh/nvm)

### Install and run

1. Run `nvm install` to install the Node version specified in `.nvmrc`
2. Run `yarn install` to install the dependencies.
3. Create a `.env` file in the root (see `.env.example` for guidance)
4. Run `docker compose up` to start the API, MongoDB, Mongo Express webclient and Redis
   For details, see `docker-compose.yml`.
5. Go to `localhost:3000/api` to access the Swagger API docs of the app and test
6. Go to `localhost:8081` to access the Mongo Express webclient
7. Run `docker-compose stop` to shut down the containers.

### Develop

Commands to run the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Test

Commands to run tests

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## What's in the Project

In terms of scope there's nothing that's too complex, just a solid set of rules and practices that will allow an API to scale while providing a easy way to add new features.

## Features

### CRUD Operations

Some examples of CRUD are implemented in the [Job](src/jobs).
It follows the core fundamentals of NestJS with a module, controller and service.

### Request Validation

Request validation is implemented as described in [NestJS docs](https://docs.nestjs.com/techniques/validation).
It's a combinations of DTOs (Data Transfer Models), with class-validator and global pipes.

### Configuration

The API is configured through a `.env` file, see the `.env.example` for guidance.

### Database

For this project we're using MongoDB, with the application using Mongoose as an ODM to enforce validation, casting and business logic through schemas.

### Testing

The template provides unit testing for the service and the controller, using the NestJS testing tools and Jest.

`TODO` e2e testing will be added in a later stage.

### API Documentation

API Documentation is provided in the format of OpenAPI.

It's available at `/api` and served through SwaggerUI.

### Logging

The application logging uses Pino due to it's flexibility, features and speed.

### Error Handling

There are three Exception filters to manage the application errors and channel them to an API response
Two of them are specific for the use case of MongoDB but also serve as an example for different needs that can arise.

There's also a custom decorator specific to the MongoDB queries that will throw an error in the form of NotFoundException when a query to the database returns an empty object.

### Queues

There's a queue example for Jobs, where when a job is created it will create an entry in a queue for later processing. This uses BullMQ to manage the queues in Redis.

## For the future

- Add authorization/authentication to the API
- Add an abstract Datasource layer to easily switch between databases
