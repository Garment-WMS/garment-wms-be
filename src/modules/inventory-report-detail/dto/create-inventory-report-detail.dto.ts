import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, ValidateIf } from 'class-validator';

export class CreateInventoryReportDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  inventoryReportId: string;

  @ApiProperty()
  @ValidateIf((o) => o.materialReceiptId === undefined)
  @IsNotEmpty()
  @IsUUID()
  productReceiptId?: string;

  @ApiProperty()
  @ValidateIf((o) => o.productReceiptId === undefined)
  @IsNotEmpty()
  @IsUUID()
  materialReceiptId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  recordedQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  storageQuantity: number;
}
