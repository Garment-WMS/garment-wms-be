import { Module } from '@nestjs/common';
import { InventoryReportDetailModule } from '../inventory-report-detail/inventory-report-detail.module';
import { InventoryReportPlanModule } from '../inventory-report-plan/inventory-report-plan.module';
import { InventoryReportModule } from '../inventory-report/inventory-report.module';
import { InventoryUpdateStatusService } from './inventory-update-status.service';
import { PrismaModule } from 'prisma/prisma.module';
import { InventoryReportPlanDetailModule } from '../inventory-report-plan-detail/inventory-report-plan-detail.module';

@Module({
  imports: [
    PrismaModule,
    InventoryReportModule,
    InventoryReportPlanModule,
    InventoryReportPlanDetailModule,
    InventoryReportDetailModule,
  ],
  providers: [InventoryUpdateStatusService],
  exports: [InventoryUpdateStatusService],
})
export class InventoryUpdateStatusModule {}
