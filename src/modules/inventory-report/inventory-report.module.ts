import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { InventoryReportController } from './inventory-report.controller';
import { InventoryReportService } from './inventory-report.service';

@Module({
  controllers: [InventoryReportController],
  imports: [MaterialVariantModule, ProductVariantModule, PrismaModule],
  providers: [InventoryReportService],
})
export class InventoryReportModule {}
