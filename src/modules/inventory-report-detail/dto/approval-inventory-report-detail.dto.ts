import { ApiProperty } from '@nestjs/swagger';
import { InventoryReportDetailStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ApprovalInventoryReportDetailDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(InventoryReportDetailStatus)
  status: InventoryReportDetailStatus;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  managerQuantityConfirm: number;
}
