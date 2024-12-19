import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InventoryReportModule } from '../inventory-report/inventory-report.module';
import { InventoryReportPlanDetailController } from './inventory-report-plan-detail.controller';
import { InventoryReportPlanDetailService } from './inventory-report-plan-detail.service';

@Module({
  controllers: [InventoryReportPlanDetailController],
  imports: [PrismaModule, InventoryReportModule],
  providers: [InventoryReportPlanDetailService],
  exports: [InventoryReportPlanDetailService],
})
export class InventoryReportPlanDetailModule {}
