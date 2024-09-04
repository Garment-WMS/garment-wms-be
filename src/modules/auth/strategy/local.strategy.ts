import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { apiSuccess, apiFailed } from 'src/common/dto/api-response';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private autheService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    // try {
    //   const user = await this.autheService.validateUser(username, password);
    //   if (!user) {
    //     throw new UnauthorizedException();
    //   }
    //   return user;
    // } catch (e) {
    //   throw e;
    // }
    //   if (e.code === 'P2025') {
    //     return apiFailed(404, null, 'User not found');
    //   }
    //   return apiFailed(500, e, 'Internal server error');
    // }
  }
}
