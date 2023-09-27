import { ArgumentsHost, Catch, ConflictException } from '@nestjs/common';
import { ApiExceptionFilter } from './api-exception.filter';
import { MongoServerError } from 'mongodb';
import { AppError } from '../errors/app.error';

enum MongoErrorCodes {
  DUPLICATE_KEY_ON_CREATE = 11000,
  DUPLICATE_KEY_ON_UPDATE = 11001,
}

@Catch(MongoServerError)
export class MongoExceptionFilter extends ApiExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    if (Object.values(MongoErrorCodes).includes(exception.code)) {
      switch (exception.code) {
        case MongoErrorCodes.DUPLICATE_KEY_ON_CREATE:
        case MongoErrorCodes.DUPLICATE_KEY_ON_UPDATE:
          return super.catch(
            new ConflictException(
              new AppError(
                'DB_VALIDATION',
                'Conflict',
                this.parseErrorMessage(exception.errmsg),
              ),
            ),
            host,
          );
        default:
      }
    }
  }
  private parseErrorMessage(errmsg: string): string {
    // errmsg example: 'E11000 duplicate key error collection: test.jobs index: itemId_1 dup key: { itemId: "4382739" }'
    const indexStr = 'index: ';
    const dupKeyStr = 'dup key';
    const parsedMsg = errmsg
      .slice(
        errmsg.indexOf(indexStr) + indexStr.length,
        errmsg.indexOf(dupKeyStr),
      )
      .split(' ')
      .join('');
    return `Conflict on index: ${parsedMsg}`;
  }
}
