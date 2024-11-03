import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { InventoryReportController } from './inventory-report.controller';
import { InventoryReportService } from './inventory-report.service';
import { InventoryReportDetailModule } from '../inventory-report-detail/inventory-report-detail.module';

@Module({
  controllers: [InventoryReportController],
  imports: [MaterialVariantModule, ProductVariantModule,InventoryReportDetailModule, PrismaModule],
  providers: [InventoryReportService],
})
export class InventoryReportModule {}
