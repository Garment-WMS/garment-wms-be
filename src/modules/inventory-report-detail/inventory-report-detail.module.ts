import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialReceiptModule } from '../material-receipt/material-receipt.module';
import { ReceiptAdjustmentModule } from '../receipt-adjustment/receipt-adjustment.module';
import { InventoryReportDetailController } from './inventory-report-detail.controller';
import { InventoryReportDetailService } from './inventory-report-detail.service';
import { IsInventoryReportDetailExistValidator } from './validator/is-inventory-report-detail-exist.validation';

@Module({
  controllers: [InventoryReportDetailController],
  imports: [PrismaModule, ReceiptAdjustmentModule, MaterialReceiptModule],
  providers: [
    InventoryReportDetailService,
    IsInventoryReportDetailExistValidator,
  ],
  exports: [InventoryReportDetailService],
})
export class InventoryReportDetailModule {}
