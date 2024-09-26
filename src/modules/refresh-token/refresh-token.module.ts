import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService],
  imports: [PrismaModule, JwtModule.register({}), ConfigModule],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
