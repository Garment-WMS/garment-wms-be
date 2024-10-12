import { PartialType } from '@nestjs/swagger';
import { CreateInspectionReportDetailDto } from './create-inspection-report-detail.dto';

export class UpdateInspectionReportDetailDto extends PartialType(
  CreateInspectionReportDetailDto,
) {}
