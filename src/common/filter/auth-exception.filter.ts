import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import iterate from 'iterare';
import { apiFailed } from '../dto/api-response';
import { ApiResponse } from '../dto/response.dto';
import { CustomAuthException } from './custom-auth-http.exception';

@Catch(CustomAuthException)
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: CustomAuthException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let logger = new Logger('AuthExceptionFilter');
    console.log('exception', exception.getStatus());
    logger.verbose('-------------Exception Start-------------');
    logger.error(exception.stack);
    logger.error(exception.message);
    logger.error(exception.getCode());
    logger.error(exception.getStatus());
    logger.verbose('-------------Exception End---------------');
    let responseBody: ApiResponse;

    let message = exception.message;
    let code = exception.getCode();
    switch (exception.message) {
      default:
        responseBody = apiFailed(
          exception.getStatusCode(),
          message,
          exception.getCode(),
        );
        break;
    }

    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }

  protected flattenConstraintValidationErrors(
    validationErrors: ValidationError[],
  ): any[] {
    return (
      iterate(validationErrors)
        // .map((error) => mapChildrenToValidationErrors(error))
        .flatten()
        .map((item) => {
          //Constraints are the validation error messages
          return {
            ...item,
            constraints: Object?.values(item?.constraints ?? {}),
          };
        })
        .flatten()
        .toArray()
    );
  }
}
