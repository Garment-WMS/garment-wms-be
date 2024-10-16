import { PartialType } from '@nestjs/swagger';
import { CreateInventoryReportDto } from './create-inventory-report.dto';

export class UpdateInventoryReportDto extends PartialType(CreateInventoryReportDto) {}
