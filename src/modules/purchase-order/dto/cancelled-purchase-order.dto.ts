import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelledPurchaseOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cancelledReason: string;
}
