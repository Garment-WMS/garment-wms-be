import { Module } from '@nestjs/common';
import { InventoryReportPlanDetailController } from './inventory-report-plan-detail.controller';
import { InventoryReportPlanDetailService } from './inventory-report-plan-detail.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [InventoryReportPlanDetailController],
  imports:[PrismaModule],
  providers: [InventoryReportPlanDetailService],
  exports: [InventoryReportPlanDetailService],
})
export class InventoryReportPlanDetailModule {}
