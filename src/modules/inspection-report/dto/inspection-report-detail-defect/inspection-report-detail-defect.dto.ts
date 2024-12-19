import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateInspectionReportDetailDefectDto
  implements Prisma.InspectionReportDetailDefectUncheckedCreateInput
{
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  inspectionReportDetailId: string;

  @ApiProperty()
  @IsUUID()
  defectId: string;

  @ApiProperty()
  @Min(1)
  @IsInt()
  @IsOptional()
  quantityByPack: number;
}
