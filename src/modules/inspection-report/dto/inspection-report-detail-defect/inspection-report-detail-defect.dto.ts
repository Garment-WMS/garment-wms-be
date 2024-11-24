import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { IsInspectionReportExist } from '../../validator/is-inspection-report-exist.validator';

export class InspectionReportDetailDefectDto
  implements Prisma.InspectionReportDetailDefectUncheckedCreateInput
{
  @ApiProperty()
  @IsInspectionReportExist()
  @IsUUID()
  @IsOptional()
  inspectionReportId: string;

  @ApiProperty()
  @IsUUID()
  defectId: string;

  @ApiProperty()
  @Min(1)
  @IsInt()
  @IsOptional()
  quantityByPack: number;
}
