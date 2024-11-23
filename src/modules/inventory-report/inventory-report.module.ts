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

@Module({
  controllers: [InventoryReportController],
  imports: [
    MaterialVariantModule,
    MaterialReceiptModule,
    ProductReceiptModule,
    ImportReceiptModule,
    ProductVariantModule,
    ImportRequestModule,
    InventoryReportDetailModule,
    PrismaModule,
  ],
  exports: [InventoryReportService],
  providers: [InventoryReportService],
})
export class InventoryReportModule {}
