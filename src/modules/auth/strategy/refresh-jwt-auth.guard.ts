import { Injectable } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { I18nService, I18nValidationError } from 'nestjs-i18n';
import { CustomAuthException } from 'src/common/filter/custom-http.exception';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {
    super();
  }
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    let error: I18nValidationError = {
      property: '',
    };

    if (info instanceof JsonWebTokenError) {
      error.value = info.message;
      error.constraints = {
        invalidToken: this.i18n.t('auth.UNAUTHORIZED'),
      };
      error.property = 'UNAUTHORIZED';
      error.target = context.switchToHttp().getRequest().headers;

      if (info.name === 'TokenExpiredError') {
        throw new CustomAuthException(401, this.i18n.t('auth.token_expired'), [
          error,
        ]);
      } else {
        throw new CustomAuthException(401, this.i18n.t('auth.invalid_token'), [
          error,
        ]);
      }
    }
    if (info instanceof Error) {
      throw new CustomAuthException(401, this.i18n.t('auth.invalid_token'), [
        error,
      ]);
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
