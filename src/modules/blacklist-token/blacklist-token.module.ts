import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { BlacklistTokenController } from './blacklist-token.controller';
import { BlacklistTokenService } from './blacklist-token.service';

@Module({
  imports: [PrismaModule],
  controllers: [BlacklistTokenController],
  providers: [BlacklistTokenService],
  exports: [BlacklistTokenService],
})
export class BlacklistTokenModule {}
