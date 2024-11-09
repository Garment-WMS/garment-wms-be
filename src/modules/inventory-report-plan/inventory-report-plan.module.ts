import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InventoryReportPlanDetailModule } from '../inventory-report-plan-detail/inventory-report-plan-detail.module';
import { InventoryReportModule } from '../inventory-report/inventory-report.module';
import { InventoryReportPlanController } from './inventory-report-plan.controller';
import { InventoryReportPlanService } from './inventory-report-plan.service';

@Module({
  controllers: [InventoryReportPlanController],
  imports: [
    PrismaModule,
    InventoryReportPlanDetailModule,
    InventoryReportModule,
  ],
  providers: [InventoryReportPlanService],
})
export class InventoryReportPlanModule {}
