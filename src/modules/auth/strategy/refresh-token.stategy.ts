import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenUser } from '../dto/authen-user.dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req.headers['refresh-token'];
          return token ? token.toString() : null;
        },
      ]),
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    console.log(req.get('refresh-token'));
    const authorizationHeader = req.get('refresh-token');
    const refreshToken = authorizationHeader
      ? authorizationHeader.replace('Bearer', '').trim()
      : '';
    const user: Partial<AuthenUser> = {
      ...payload,
      // accountId: payload.accountId,
      // accessToken: '',
      // role: payload?.role,
      // user: undefined,
      // refreshToken: refreshToken,
    };
    return user;
  }
}
