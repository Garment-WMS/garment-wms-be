import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { IsInventoryReportDetailExist } from '../validator/is-inventory-report-detail-exist.validation';

export class WarehouseStaffApprovalInventoryReportDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsInventoryReportDetailExist()
  inventoryReportDetailId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  actualQuantity: number;
}
