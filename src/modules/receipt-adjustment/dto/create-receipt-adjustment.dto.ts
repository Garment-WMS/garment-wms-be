import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateReceiptAdjustmentDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  inventoryReportDetailId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  beforeAdjustQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  afterAdjustQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  warehouseManagerId: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  materialReceiptId: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  productReceiptId: string;
}
