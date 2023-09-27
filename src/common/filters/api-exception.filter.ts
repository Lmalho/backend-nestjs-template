import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { AppError, AppErrorDetails } from '../errors/app.error';

type ApiExceptionResponse = {
  statusCode: number;
  message: string;
  errorCode?: string;
  details?: AppErrorDetails;
};

@Catch()
export class ApiExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // Default response for unknown errors
    let exceptionResponse: ApiExceptionResponse = {
      statusCode: 500,
      message: exception.message,
    };
    if (exception instanceof HttpException) {
      exceptionResponse = this.getHttpException(exception);
    }

    // Log all server exceptions
    if (exceptionResponse.statusCode === 500) {
      this.logger.error(exception);
    }

    this.sendErrorResponse(response, exceptionResponse);
  }

  private getHttpException(exception: HttpException): ApiExceptionResponse {
    const exceptionResponse: ApiExceptionResponse = {
      statusCode: exception.getStatus(),
      message: exception.message,
    };

    const exceptionDetail = exception.getResponse() as
      | string
      | AppError
      | Error;

    if (exceptionDetail) {
      if (exceptionDetail instanceof AppError) {
        return {
          ...exceptionResponse,
          errorCode: exceptionDetail.errorCode,
          details: exceptionDetail.details,
        };
      }
      if (exceptionDetail instanceof Error) {
        return {
          ...exceptionResponse,
          message: exceptionDetail.message,
        };
      }
      if (typeof exceptionDetail === 'string') {
        return {
          ...exceptionResponse,
          message: exceptionDetail,
        };
      }
    }
    return exceptionResponse;
  }

  private sendErrorResponse(
    response: Response,
    exceptionResponse: ApiExceptionResponse,
  ) {
    const { statusCode, message, errorCode, details } = exceptionResponse;
    const errorResponse: ApiExceptionResponse = {
      statusCode,
      message,
      errorCode: errorCode ?? HttpStatus[statusCode],
      details,
    };
    response.status(statusCode).json(errorResponse);
  }
}
