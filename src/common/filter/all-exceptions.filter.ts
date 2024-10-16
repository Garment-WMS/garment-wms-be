import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { ValidationError } from 'class-validator';
import iterate from 'iterare';
import { apiFailed } from '../dto/api-response';
import { ApiResponse } from '../dto/response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    isLogged: boolean = false,
  ) {
    this.isLogged = isLogged;
  }

  private isLogged: boolean;

  catch(exception: unknown, host: ArgumentsHost): void {
    if (!this.isLogged) {
      const logger = new Logger(AllExceptionsFilter.name);
      logger.verbose('-------------Exception Start-------------');
      exception instanceof Error
        ? logger.error(exception.message, exception.stack)
        : logger.error(exception);
      logger.verbose('-------------Exception End---------------');
    }

    const ctx = host.switchToHttp();

    let responseBody: ApiResponse;
    if (exception instanceof HttpException) {
      responseBody = apiFailed(
        exception.getStatus(),
        exception.message,
        exception.getResponse(),
      );
    } else if (
      exception instanceof Error &&
      exception.message.includes('is not filterable')
    ) {
      responseBody = apiFailed(HttpStatus.BAD_REQUEST, exception.message);
    } else {
      responseBody = apiFailed(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Something went wrong',
      );
    }

    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }

  protected flattenConstraintValidationErrors(
    validationErrors: ValidationError[],
  ): any[] {
    return iterate(validationErrors)
      .flatten()
      .map((item) => {
        //Constraints are the validation error messages
        return {
          ...item,
          constraints: Object?.values(item?.constraints ?? {}),
        };
      })
      .flatten()
      .toArray();
  }
}
