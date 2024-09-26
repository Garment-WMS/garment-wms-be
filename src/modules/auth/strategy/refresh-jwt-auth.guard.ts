import { Injectable } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ValidationError } from 'class-validator';
import { CustomAuthException } from 'src/common/filter/custom-http.exception';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    let error: ValidationError = {
      property: '',
    };

    if (info instanceof JsonWebTokenError) {
      error.value = info.message;
      error.constraints = {
        invalidToken: 'Unauthorized',
      };
      error.property = 'UNAUTHORIZED';
      error.target = context.switchToHttp().getRequest().headers;

      if (info.name === 'TokenExpiredError') {
        throw new CustomAuthException(401, 'Token expired', [error]);
      } else {
        throw new CustomAuthException(401, 'Invalid token', [error]);
      }
    }
    if (info instanceof Error) {
      throw new CustomAuthException(401, 'Invalid token', [error]);
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
