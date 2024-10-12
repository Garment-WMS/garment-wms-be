import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { UpsertInspectionReportDetailDto } from '../inspection-report-detail/upsert-inspection-report-detail.dto';
import { CreateInspectionReportDto } from './create-inspection-report.dto';

export class UpdateInspectionReportDto extends OmitType(
  CreateInspectionReportDto,
  ['inspectionReportDetail'],
) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  inspectionReportDetail?: UpsertInspectionReportDetailDto[];
}
