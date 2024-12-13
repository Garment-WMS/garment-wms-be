import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InventoryReportDetailModule } from '../inventory-report-detail/inventory-report-detail.module';
import { MaterialReceiptModule } from '../material-receipt/material-receipt.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ProductReceiptModule } from '../product-receipt/product-receipt.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { InventoryReportController } from './inventory-report.controller';
import { InventoryReportService } from './inventory-report.service';
import { ImportReceiptModule } from '../import-receipt/import-receipt.module';
import { ImportRequestModule } from '../import-request/import-request.module';
import { InventoryReportPlanModule } from '../inventory-report-plan/inventory-report-plan.module';
import { MaterialExportReceiptModule } from '../material-export-receipt/material-export-receipt.module';
import { MaterialExportRequestModule } from '../material-export-request/material-export-request.module';
import { TaskModule } from '../task/task.module';

@Module({
  controllers: [InventoryReportController],
  imports: [
    MaterialVariantModule,
    MaterialExportReceiptModule,
    MaterialExportRequestModule,
    MaterialReceiptModule,
    ProductReceiptModule,
    ImportReceiptModule,
    ProductVariantModule,
    ImportRequestModule,
    InventoryReportDetailModule,
    // InventoryReportPlanModule,
    PrismaModule,
    TaskModule,
  ],
  exports: [InventoryReportService],
  providers: [InventoryReportService],
})
export class InventoryReportModule {}
