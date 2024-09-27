import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ValidationError } from 'class-validator';
import { Observable } from 'rxjs';
import { CustomAuthException } from 'src/common/filter/custom-http.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    let error: ValidationError = {
      property: '',
    };

    if (info instanceof JsonWebTokenError) {
      if (info.name === 'TokenExpiredError') {
        error.value = info.message;
        error.constraints = {
          invalidToken: 'Token expired',
        };
        error.target = context.switchToHttp().getRequest().headers;
        error.property = 'TOKEN_EXPIRED';
        throw new CustomAuthException(401, 'Token expired', [error]);
      } else {
        error.value = info.message;
        error.constraints = {
          invalidToken: 'Invalid token',
        };
        error.property = 'INVALID_TOKEN';
        error.target = context.switchToHttp().getRequest().headers;

        throw new CustomAuthException(401, 'Invalid token', [error]);
      }
    }
    if (info instanceof Error) {
      error.value = info.message;
      error.constraints = {
        invalidToken: 'Unauthorized',
      };
      error.property = 'UNAUTHORIZED';
      error.target = context.switchToHttp().getRequest().headers;

      throw new CustomAuthException(401, 'Unauthorized', [error]);
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
