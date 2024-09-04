import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import express from 'express';
import { I18nContext, I18nValidationError } from 'nestjs-i18n';
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
      const i18n = I18nContext.current();

      let error: I18nValidationError = {
        property: '',
      };

      error.value = token;
      error.constraints = {
        invalidToken: i18n.t('auth.blacklist_token'),
      };
      error.property = 'INVALID_TOKEN';
      error.target = req.headers;

      throw new CustomAuthException(401, i18n.t('auth.invalid_token'), [error]);
    }
    console.log('payload', payload);
    const user: Partial<AuthenUser> = {
      ...payload,
      accountId: payload.accountId,
      accessToken: token,
      role: payload.role,
    };
    return user;
  }
}
