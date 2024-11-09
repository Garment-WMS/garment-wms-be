import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReceiptAdjustmentModule } from '../receipt-adjustment/receipt-adjustment.module';
import { InventoryReportDetailController } from './inventory-report-detail.controller';
import { InventoryReportDetailService } from './inventory-report-detail.service';
import { InventoryReportModule } from '../inventory-report/inventory-report.module';
import { InventoryUpdateStatusModule } from '../inventory-update-status/inventory-update-status.module';

@Module({
  controllers: [InventoryReportDetailController],
  imports: [PrismaModule, ReceiptAdjustmentModule],
  providers: [InventoryReportDetailService],
  exports: [InventoryReportDetailService],
})
export class InventoryReportDetailModule {}
