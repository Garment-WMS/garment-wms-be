import { PartialType } from '@nestjs/swagger';
import { CreateInventoryReportPlanDto } from './create-inventory-report-plan.dto';

export class UpdateInventoryReportPlanDto extends PartialType(CreateInventoryReportPlanDto) {}
