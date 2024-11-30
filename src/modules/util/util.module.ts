import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UtilController } from './util.controller';
import { UtilService } from './util.service';

@Module({
  imports: [PrismaModule],
  controllers: [UtilController],
  providers: [UtilService],
})
export class UtilModule {}
