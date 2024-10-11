import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateInspectionReportDto } from './create-inspection-report.dto';

export class UpdateInspectionReportDto extends PartialType(
  CreateInspectionReportDto,
) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;
}
