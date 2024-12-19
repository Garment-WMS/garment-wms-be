import { PartialType } from '@nestjs/swagger';
import { CreateInventoryReportDetailDto } from './create-inventory-report-detail.dto';

export class UpdateInventoryReportDetailDto extends PartialType(CreateInventoryReportDetailDto) {}
