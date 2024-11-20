import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ValidationError } from 'class-validator';
import { apiFailed } from '../dto/api-response';
import { ApiResponse } from '../dto/response.dto';
import { PrismaErrorEnum } from '../enum/prisma-error.enum';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let logger = new Logger('PrismaExceptionFilter');
    logger.verbose('-------------Exception Start-------------');
    logger.error(exception.stack || exception.message);
    logger.verbose('-------------Exception End---------------');
    let responseBody: ApiResponse;
    let message = exception.message;
    let error: ValidationError = {
      property: undefined,
      value: undefined,
      contexts: {},
      children: [],
      target: undefined,
      constraints: undefined,
    };

    switch (exception.code) {
      case PrismaErrorEnum.OperationDependencyNotFound:
        if (exception.meta?.target) {
          error.property = exception.meta.target as string;
          message =
            'Operation failed because it depends on one or more records that were required but not found';
        }
        responseBody = apiFailed(HttpStatus.NOT_FOUND, message, [error]);
        break;
      case PrismaErrorEnum.ForeignKeyConstraintFailed:
        message = 'A foreign key constraint was violated on a record';
        if (exception.meta?.field_name) {
          error.property = exception.meta.target as string;
        }
        responseBody = apiFailed(HttpStatus.CONFLICT, message, [error]);
        break;

      case PrismaErrorEnum.UniqueConstraintFailed:
        message = `An operation failed because it would violate a primary key constraint ${exception.meta.target}`;
        responseBody = apiFailed(HttpStatus.CONFLICT, message, exception.meta);
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
