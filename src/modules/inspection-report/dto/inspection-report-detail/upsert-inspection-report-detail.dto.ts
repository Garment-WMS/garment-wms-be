import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateInspectionReportDetailDto } from './create-inspection-report-detail.dto';

export class UpsertInspectionReportDetailDto extends CreateInspectionReportDetailDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;
}
