import { PartialType } from '@nestjs/swagger';
import { CreateInventoryReportPlanDetailDto } from './create-inventory-report-plan-detail.dto';

export class UpdateInventoryReportPlanDetailDto extends PartialType(CreateInventoryReportPlanDetailDto) {}
