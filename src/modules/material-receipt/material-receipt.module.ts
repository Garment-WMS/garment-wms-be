import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialModule } from '../material/material.module';
import { MaterialReceiptController } from './material-receipt.controller';
import { MaterialReceiptService } from './material-receipt.service';

@Module({
  controllers: [MaterialReceiptController],
  imports: [PrismaModule, MaterialModule],
  providers: [MaterialReceiptService],
  exports: [MaterialReceiptService],
})
export class MaterialReceiptModule {}
