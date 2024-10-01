import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UomController } from './uom.controller';
import { UomService } from './uom.service';

@Module({
  controllers: [UomController],
  imports: [PrismaModule],
  providers: [UomService],
})
export class UomModule {}
