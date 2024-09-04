import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import iterate from 'iterare';
import { I18nValidationException } from 'nestjs-i18n';
import { mapChildrenToValidationErrors } from 'nestjs-i18n/dist/utils';
import { apiFailed } from '../dto/api-response';
import { ApiResponse } from '../dto/response.dto';
import { CustomAuthException } from './custom-http.exception';

@Catch(CustomAuthException)
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let logger = new Logger('AuthExceptionFilter');
    console.log('exception', exception.getStatus());
    logger.verbose('-------------Exception Start-------------');
    logger.error(exception.stack);
    logger.error(exception.message);
    logger.error(exception.errors);
    logger.error(exception.getStatus());
    logger.verbose('-------------Exception End---------------');
    let responseBody: ApiResponse;

    let message = exception.message;
    let errors = this.flattenConstraintValidationErrors(exception.errors);
    switch (exception.message) {
      default:
        responseBody = apiFailed(exception.getStatus(), message, errors);
        break;
    }

    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }

  protected flattenConstraintValidationErrors(
    validationErrors: ValidationError[],
  ): any[] {
    return iterate(validationErrors)
      .map((error) => mapChildrenToValidationErrors(error))
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
