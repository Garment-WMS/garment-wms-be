import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelPoDeliveryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  cancelReason: string;
}
