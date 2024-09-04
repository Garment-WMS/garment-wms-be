import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { I18nService, I18nValidationError } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { CustomAuthException } from 'src/common/filter/custom-http.exception';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {
    super();
  }
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    let error: I18nValidationError = {
      property: '',
    };

    if (info instanceof JsonWebTokenError) {
      if (info.name === 'TokenExpiredError') {
        error.value = info.message;
        error.constraints = {
          invalidToken: this.i18n.t('auth.token_expired'),
        };
        error.target = context.switchToHttp().getRequest().headers;
        error.property = 'TOKEN_EXPIRED';
        throw new CustomAuthException(401, this.i18n.t('auth.token_expired'), [
          error,
        ]);
      } else {
        error.value = info.message;
        error.constraints = {
          invalidToken: this.i18n.t('auth.invalid_token'),
        };
        error.property = 'INVALID_TOKEN';
        error.target = context.switchToHttp().getRequest().headers;

        throw new CustomAuthException(401, this.i18n.t('auth.invalid_token'), [
          error,
        ]);
      }
    }
    if (info instanceof Error) {
      error.value = info.message;
      error.constraints = {
        invalidToken: this.i18n.t('auth.UNAUTHORIZED'),
      };
      error.property = 'UNAUTHORIZED';
      error.target = context.switchToHttp().getRequest().headers;

      throw new CustomAuthException(401, this.i18n.t('auth.invalid_token'), [
        error,
      ]);
    }

    return super.handleRequest(err, user, info, context, status);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
