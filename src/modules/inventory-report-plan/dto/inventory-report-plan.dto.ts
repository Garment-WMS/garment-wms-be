import { InventoryReportPlanStatus, Prisma } from '@prisma/client';
import { InventoryReportPlanDetailDto } from './inventory-report-plan-detail.dto';

export class InventoryReportPlanDto {
  id: string;
  warehouseManagerId: string;
  title: string;
  code: string;
  note: string;
  status: InventoryReportPlanStatus;
  inventoryReportPlanDetail: InventoryReportPlanDetailDto[];
}
