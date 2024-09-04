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
import { I18nService, I18nValidationError } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { apiFailed } from '../dto/api-response';
import { ApiResponse } from '../dto/response.dto';
import { PrismaErrorEnum } from '../enum/prisma-error.enum';

@Catch(PrismaClientKnownRequestError, PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let logger = new Logger('PrismaExceptionFilter');
    logger.verbose('-------------Exception Start-------------');
    logger.error(exception.stack);
    logger.verbose('-------------Exception End---------------');
    let responseBody: ApiResponse;
    let message = exception.message;
    let error: I18nValidationError = {
      property: '',
      value: undefined,
      contexts: {},
      children: [],
      target: undefined,
      constraints: undefined,
    };
    switch (exception.code) {
      case PrismaErrorEnum.OperationDependencyNotFound:
        //Room
        if (exception.meta?.target === 'room') {
          message = this.i18n.t('prisma.NOT_FOUND', {
            args: {
              entity: this.i18n.t('room.room_object_name'),
            },
          });
          //To know which property are we searching
          if (exception.meta?.property) {
            error.property = exception.meta.property as string;
          }

          responseBody = apiFailed(HttpStatus.NOT_FOUND, message, [error]);
        }

        //Room service
        else if (exception.meta?.target === 'roomService') {
          message = this.i18n.t('prisma.NOT_FOUND', {
            args: {
              entity: this.i18n.t('room-service.room_service_object_name'),
            },
          });
          //To know which property are we searching
          if (exception.meta?.property) {
            error.property = exception.meta.property as string;
          }
          responseBody = apiFailed(HttpStatus.NOT_FOUND, message, [error]);
        } else {
          message = exception?.message
            ? exception.message
            : this.i18n.t('prisma.NOT_FOUND', {});
          responseBody = apiFailed(HttpStatus.CONFLICT, message, [error]);
        }
        break;
      case PrismaErrorEnum.ForeignKeyConstraintFailed:
        message = this.i18n.t('prisma.FOREIGN_KEY_CONSTRAINT', {
          args: {
            target: exception.meta.field_name,
          },
        });
        if (exception.meta.field_name) {
          error.property = exception.meta.field_name as string;
        }
        responseBody = apiFailed(HttpStatus.CONFLICT, message, [error]);
        break;

      case PrismaErrorEnum.UniqueConstraintFailed:
        message = this.i18n.t('prisma.UNIQUE_CONSTRAINT', {
          args: {
            target: exception.meta.target,
          },
        });
        if (exception.meta.target) {
          error.property = exception.meta.target as string;
        }
        responseBody = apiFailed(HttpStatus.CONFLICT, message, [error]);
        break;
      case PrismaErrorEnum.DatabaseConnectionFailed:
        message = this.i18n.t('prisma.DATABASE_CONNECTION_FAILED', {});
        responseBody = apiFailed(HttpStatus.INTERNAL_SERVER_ERROR, message);
        break;
      case PrismaErrorEnum.RequiredRecordNotFound:
        message = this.i18n.t('prisma.NO_RECORD_FOUND', {});
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
