import { ApiProperty } from '@nestjs/swagger';
import { $Enums, PurchaseOrderStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdatePurchaseOrderDto {
  @ApiProperty({ required: false })
  @IsEnum([PurchaseOrderStatus.FINISHED])
  @IsOptional()
  status?: $Enums.PurchaseOrderStatus;
}
