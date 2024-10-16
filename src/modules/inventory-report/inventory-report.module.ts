import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialModule } from '../material/material.module';
import { ProductModule } from '../product/product.module';
import { InventoryReportController } from './inventory-report.controller';
import { InventoryReportService } from './inventory-report.service';

@Module({
  controllers: [InventoryReportController],
  imports: [MaterialModule, ProductModule, PrismaModule],
  providers: [InventoryReportService],
})
export class InventoryReportModule {}
