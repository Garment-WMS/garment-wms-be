import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InventoryReportPlanDetailModule } from '../inventory-report-plan-detail/inventory-report-plan-detail.module';
import { InventoryReportModule } from '../inventory-report/inventory-report.module';
import { MaterialPackageModule } from '../material-package/material-package.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ProductSizeModule } from '../product-size/product-size.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { InventoryReportPlanController } from './inventory-report-plan.controller';
import { InventoryReportPlanService } from './inventory-report-plan.service';
import { ImportRequestModule } from '../import-request/import-request.module';
import { MaterialExportRequestModule } from '../material-export-request/material-export-request.module';
import { TaskModule } from '../task/task.module';

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
    ImportRequestModule,
    ProductSizeModule,
  ],
  providers: [InventoryReportPlanService],
  exports: [InventoryReportPlanService],
})
export class InventoryReportPlanModule {}
