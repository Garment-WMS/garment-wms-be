import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ImportReceiptModule } from '../import-receipt/import-receipt.module';
import { ImportRequestModule } from '../import-request/import-request.module';
import { InventoryReportPlanDetailModule } from '../inventory-report-plan-detail/inventory-report-plan-detail.module';
import { InventoryReportModule } from '../inventory-report/inventory-report.module';
import { MaterialExportReceiptModule } from '../material-export-receipt/material-export-receipt.module';
import { MaterialExportRequestModule } from '../material-export-request/material-export-request.module';
import { MaterialPackageModule } from '../material-package/material-package.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ProductSizeModule } from '../product-size/product-size.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { TaskModule } from '../task/task.module';
import { InventoryReportPlanController } from './inventory-report-plan.controller';
import { InventoryReportPlanProcessor } from './inventory-report-plan.processor';
import { InventoryReportPlanService } from './inventory-report-plan.service';

@Module({
  controllers: [InventoryReportPlanController],
  imports: [
    PrismaModule,
    TaskModule,
    MaterialExportRequestModule,
    InventoryReportPlanDetailModule,
    InventoryReportModule,
    MaterialPackageModule,
    MaterialVariantModule,
    ProductVariantModule,
    ImportReceiptModule,
    ImportRequestModule,
    ProductSizeModule,
    MaterialExportReceiptModule,
    BullModule.registerQueue({ name: 'inventory-report-plan' }),
  ],
  providers: [InventoryReportPlanService, InventoryReportPlanProcessor],
  exports: [InventoryReportPlanService, InventoryReportPlanProcessor],
})
export class InventoryReportPlanModule {}
