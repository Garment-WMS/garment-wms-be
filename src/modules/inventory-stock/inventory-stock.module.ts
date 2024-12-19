import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InspectionReportModule } from '../inspection-report/inspection-report.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { InventoryStockController } from './inventory-stock.controller';
import { InventoryStockService } from './inventory-stock.service';

@Module({
  controllers: [InventoryStockController],
  imports: [
    PrismaModule,
    MaterialVariantModule,
    ProductVariantModule,
    // InspectionReportModule,
  ],
  providers: [InventoryStockService],
  exports: [InventoryStockService],
})
export class InventoryStockModule {}
