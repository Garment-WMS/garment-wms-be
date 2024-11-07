import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReceiptAdjustmentController } from './receipt-adjustment.controller';
import { ReceiptAdjustmentProcessor } from './receipt-adjustment.processor';
import { ReceiptAdjustmentService } from './receipt-adjustment.service';

@Module({
  controllers: [ReceiptAdjustmentController],
  imports: [
    BullModule.registerQueue({ name: 'receipt-adjustment' }),
    PrismaModule,
  ],
  providers: [ReceiptAdjustmentService, ReceiptAdjustmentProcessor],
  exports: [ReceiptAdjustmentService, ReceiptAdjustmentProcessor,BullModule],
})
export class ReceiptAdjustmentModule {}
