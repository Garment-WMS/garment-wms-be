import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateInspectionReportDetailDto } from './create-inspection-report-detail.dto';

export class UpdateInspectionReportDetailDto extends OmitType(
  PartialType(CreateInspectionReportDetailDto),
  ['inspectionReportId'], //can not update inspectionReportId
) {}
