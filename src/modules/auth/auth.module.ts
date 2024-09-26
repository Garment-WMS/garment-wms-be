import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { BlacklistTokenModule } from '../blacklist-token/blacklist-token.module';
import { MailService } from '../mail/mail.service';
import { OtpService } from '../otp/otp.service';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.stategy';

@Module({
  controllers: [AuthController],
  imports: [
    PrismaModule,
    JwtModule.register({}),
    UserModule,
    ConfigModule,
    RefreshTokenModule,
    BlacklistTokenModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    RefreshTokenStrategy,
    AccessTokenStrategy,
    MailService,
    OtpService,
  ],
})
export class AuthModule {}
