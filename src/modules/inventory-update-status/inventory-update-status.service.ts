import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  InventoryReportPlanStatus,
  InventoryReportStatus,
} from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { InventoryReportPlanDetailService } from '../inventory-report-plan-detail/inventory-report-plan-detail.service';
import { InventoryReportPlanService } from '../inventory-report-plan/inventory-report-plan.service';
import { InventoryReportService } from '../inventory-report/inventory-report.service';

@Injectable()
export class InventoryUpdateStatusService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly inventoryReportService: InventoryReportService,
    private readonly inventoryReportPlanService: InventoryReportPlanService,
    private readonly inventoryReportPlanDetailService: InventoryReportPlanDetailService,
  ) {}

  @OnEvent('inventory-report.status')
  async handleInventoryUpdateStatusCreatedEvent(inventoryReportId: string) {
    await this.inventoryReportService.updateStatus(
      inventoryReportId,
      InventoryReportStatus.FINISHED,
    );

    //Also is inventory report belong to a plan, check if it is the last inventory report in the plan
    const isLastInventoryReportInPlan =
      await this.inventoryReportPlanDetailService.checkLastInventoryReportInPlan(
        inventoryReportId,
      );

    if (isLastInventoryReportInPlan) {
      await this.inventoryReportPlanService.updateStatus(
        isLastInventoryReportInPlan,
        InventoryReportPlanStatus.DONE,
      );
    }
  }
}

// Helper function to create a delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
