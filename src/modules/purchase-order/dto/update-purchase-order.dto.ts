import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdatePurchaseOrderDto {
  @ApiProperty({ required: false })
  @IsEnum($Enums.PurchaseOrderStatus)
  @IsOptional()
  status?: $Enums.PurchaseOrderStatus;
}
