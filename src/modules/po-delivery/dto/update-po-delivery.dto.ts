import { ApiProperty } from '@nestjs/swagger';
import { PoDeliveryStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { CreatePoDeliveryDto } from './create-po-delivery.dto';

export class UpdatePoDeliveryDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(PoDeliveryStatus)
  status: PoDeliveryStatus;
  note: string;
  poDeliveryDetail: CreatePoDeliveryDto[];
}
