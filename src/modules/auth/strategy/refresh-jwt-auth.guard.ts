import { Injectable } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { CustomAuthException } from 'src/common/filter/custom-auth-http.exception';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof JsonWebTokenError) {
      if (info.name === 'TokenExpiredError') {
        throw new CustomAuthException(401, 'Token expired', ['UNAUTHORIZED']);
      } else {
        throw new CustomAuthException(401, 'Invalid token', ['UNAUTHORIZED']);
      }
    }
    if (info instanceof Error) {
      throw new CustomAuthException(401, 'Invalid token', ['UNAUTHORIZED']);
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
