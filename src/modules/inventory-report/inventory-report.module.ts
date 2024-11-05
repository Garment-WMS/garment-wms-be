import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InventoryReportDetailModule } from '../inventory-report-detail/inventory-report-detail.module';
import { MaterialReceiptModule } from '../material-receipt/material-receipt.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { InventoryReportController } from './inventory-report.controller';
import { InventoryReportService } from './inventory-report.service';

@Module({
  controllers: [InventoryReportController],
  imports: [
    MaterialVariantModule,
    MaterialReceiptModule,
    
    ProductVariantModule,
    InventoryReportDetailModule,
    PrismaModule,
  ],
  exports: [InventoryReportService],
  providers: [InventoryReportService],
})
export class InventoryReportModule {}
