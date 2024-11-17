import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { IsInventoryReportDetailExist } from '../validator/is-inventory-report-detail-exist.validation';

export class WarehouseManagerApprovalInventoryReportDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsInventoryReportDetailExist()
  inventoryReportDetailId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  managerConfirmQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note?: string;
}