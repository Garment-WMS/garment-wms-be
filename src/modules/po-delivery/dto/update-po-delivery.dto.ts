import { ApiProperty } from '@nestjs/swagger';
import { PoDeliveryStatus } from '@prisma/client';
import { IsArray, IsDate, IsDateString, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { CreatePoDeliveryDto } from './create-po-delivery.dto';
import { Type } from 'class-transformer';
import { UpdatePoDeliveryMaterialDto } from 'src/modules/po-delivery-material/dto/update-po-delivery-material.dto';

export class UpdatePoDeliveryDto {
  // @ApiProperty()
  // @IsOptional()
  // @IsEnum(PoDeliveryStatus)
  // status: PoDeliveryStatus;
  // note: string;
  // poDeliveryDetail: CreatePoDeliveryDto[];

  @ApiProperty()
  @IsOptional()
  @IsDate()
  expectedDeliveryDate:Date 

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @Type(() => UpdatePoDeliveryMaterialDto) 
  poDeliveryDetails: UpdatePoDeliveryMaterialDto[]
  

}

