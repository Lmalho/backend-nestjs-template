import { Error as MongooseErrorNamespace } from 'mongoose';
import { ApiExceptionFilter } from './api-exception.filter';
import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { AppError } from '../errors/app.error';

@Catch(MongooseErrorNamespace.ValidationError)
export class MongooseExceptionFilter extends ApiExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    if (exception instanceof MongooseErrorNamespace.ValidationError) {
      return super.catch(
        new BadRequestException(
          new AppError('DB_VALIDATION', 'Bad Request', exception.message),
        ),
        host,
      );
    }
    return super.catch(exception, host);
  }
}
