import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { MaterialReceiptController } from './material-receipt.controller';
import { MaterialReceiptService } from './material-receipt.service';

@Module({
  controllers: [MaterialReceiptController],
  imports: [PrismaModule, MaterialVariantModule],
  providers: [MaterialReceiptService],
  exports: [MaterialReceiptService],
})
export class MaterialReceiptModule {}
