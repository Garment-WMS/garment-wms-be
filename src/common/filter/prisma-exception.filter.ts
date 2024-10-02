import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { ValidationError } from 'class-validator';
import { apiFailed } from '../dto/api-response';
import { ApiResponse } from '../dto/response.dto';
import { PrismaErrorEnum } from '../enum/prisma-error.enum';

@Catch(PrismaClientKnownRequestError, PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let logger = new Logger('PrismaExceptionFilter');
    logger.verbose('-------------Exception Start-------------');
    logger.error(exception.stack);
    logger.error(exception.meta);
    logger.verbose('-------------Exception End---------------');
    let responseBody: ApiResponse;
    let message = exception.message;
    let error: ValidationError = {
      property: '',
      value: undefined,
      contexts: {},
      children: [],
      target: undefined,
      constraints: undefined,
    };
    switch (exception.code) {
      case PrismaErrorEnum.OperationDependencyNotFound:
        message =
          'Operation failed because it depends on one or more records that were required but not found';
        if (exception.meta.target) {
          error.property = exception.meta.target as string;
        }
        responseBody = apiFailed(HttpStatus.BAD_REQUEST, message, [error]);
        break;
      case PrismaErrorEnum.ForeignKeyConstraintFailed:
        message = 'A foreign key constraint was violated on a record';
        if (exception.meta.field_name) {
          error.property = exception.meta.field_name as string;
        }
        responseBody = apiFailed(HttpStatus.CONFLICT, message, [error]);
        break;

      case PrismaErrorEnum.UniqueConstraintFailed:
        message = 'A unique constraint was violated on a record';
        if (exception.meta.target) {
          error.property = exception.meta.target as string;
        }
        responseBody = apiFailed(HttpStatus.CONFLICT, message, [error]);
        break;
      case PrismaErrorEnum.DatabaseConnectionFailed:
        message = 'Database connection failed';
        responseBody = apiFailed(HttpStatus.INTERNAL_SERVER_ERROR, message);
        break;
      case PrismaErrorEnum.RequiredRecordNotFound:
        message = 'Required record not found';
        responseBody = apiFailed(HttpStatus.BAD_REQUEST, message);
        break;
      default:
        responseBody = apiFailed(HttpStatus.BAD_REQUEST, message);
        break;
    }

    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
