import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class ReassignMaterialExportRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  warehouseStaffId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  materialExportRequestId: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  expectedStartedAt: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  expectedFinishedAt: Date;
}
