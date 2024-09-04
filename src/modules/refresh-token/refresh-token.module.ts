import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenController } from './refresh-token.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, PrismaService],
  imports: [JwtModule.register({}), ConfigModule],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
