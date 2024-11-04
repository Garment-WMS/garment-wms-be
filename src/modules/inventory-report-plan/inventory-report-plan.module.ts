import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InventoryReportPlanController } from './inventory-report-plan.controller';
import { InventoryReportPlanService } from './inventory-report-plan.service';
import { InventoryReportPlanDetailModule } from '../inventory-report-plan-detail/inventory-report-plan-detail.module';

@Module({
  controllers: [InventoryReportPlanController],
  imports: [PrismaModule, InventoryReportPlanDetailModule],
  providers: [InventoryReportPlanService],
})
export class InventoryReportPlanModule {}
