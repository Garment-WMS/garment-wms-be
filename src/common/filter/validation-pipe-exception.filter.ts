import { ArgumentsHost, Catch, Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { apiFailed } from '../dto/api-response';
import { ApiResponse } from '../dto/response.dto';
import { CustomValidationException } from './custom-validation.exception';

@Catch(CustomValidationException)
export class ValidationPipeExceptionFilter extends ValidationPipe {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    isLogged: boolean = false,
  ) {
    super();
    this.isLogged = isLogged;
  }

  private isLogged: boolean;

  catch(exception: CustomValidationException, host: ArgumentsHost): void {
    if (!this.isLogged) {
      const logger = new Logger(ValidationPipeExceptionFilter.name);
      logger.verbose('-------------Exception Start-------------');
      exception instanceof Error
        ? logger.error(exception.message, exception.stack)
        : logger.error(exception);
      logger.verbose('-------------Exception End---------------');
    }

    const ctx = host.switchToHttp();

    let responseBody: ApiResponse = apiFailed(
      exception.statusCode,
      exception.message,
      exception.error,
    );

    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
