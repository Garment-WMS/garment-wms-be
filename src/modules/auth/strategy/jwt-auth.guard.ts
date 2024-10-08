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
        throw new CustomAuthException(401, 'Token expired', ['TOKEN_EXPIRED']);
      } else {
        throw new CustomAuthException(401, 'Invalid token', ['INVALID_TOKEN']);
      }
    }
    if (info instanceof Error) {
      throw new CustomAuthException(401, 'Unauthorized', ['UNAUTHORIZED']);
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
