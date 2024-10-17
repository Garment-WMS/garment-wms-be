import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ValidationError } from 'class-validator';
import express from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomAuthException } from 'src/common/filter/custom-http.exception';
import { BlacklistTokenService } from 'src/modules/blacklist-token/blacklist-token.service';
import { AuthenUser } from '../dto/authen-user.dto';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private blackListTokenService: BlacklistTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: express.Request, payload: any) {
    const token =
      ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()])(
        req,
      ) || ''; // Extract the JWT from request
    // Check if token is blacklisted before returning user data
    const isBlacklisted =
      await this.blackListTokenService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      let error: ValidationError = {
        property: '',
      };

      error.value = token;
      error.constraints = {
        invalidToken: 'Token blacklisted',
      };
      error.property = 'INVALID_TOKEN';
      error.target = req.headers;

      throw new CustomAuthException(401, 'Invalid token', [error]);
    }
    const user: Partial<AuthenUser> = {
      ...payload,
      userId: payload.userId,
      accessToken: token,
      role: payload.role,
    };
    return user;
  }
}
