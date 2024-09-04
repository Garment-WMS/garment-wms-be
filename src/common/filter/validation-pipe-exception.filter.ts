import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { apiFailed } from '../dto/api-response';
import { ApiResponse } from '../dto/response.dto';
import { ValidationError } from 'class-validator';

@Catch()
export class ValidationPipeExceptionFilter extends ValidationPipe {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    isLogged: boolean = false,
  ) {
    super();
    this.isLogged = isLogged;
  }

  private isLogged: boolean;

  catch(exception: unknown, host: ArgumentsHost): void {
    if (!this.isLogged) {
      const logger = new Logger(ValidationPipeExceptionFilter.name);
      logger.verbose('-------------Exception Start-------------');
      exception instanceof Error
        ? logger.error(exception.message, exception.stack)
        : logger.error(exception);
      logger.verbose('-------------Exception End---------------');
    }

    const ctx = host.switchToHttp();

    let responseBody: ApiResponse;
    if (exception instanceof BadRequestException) {
      const response = exception.getResponse() as any;
      responseBody = apiFailed(400, response.message, response.error);
    } else if (exception instanceof HttpException) {
      responseBody = apiFailed(exception.getStatus(), exception.message);
    } else {
      responseBody = apiFailed(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Something went wrong',
      );
    }

    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
