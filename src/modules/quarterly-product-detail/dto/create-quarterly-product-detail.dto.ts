import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateQuarterlyProductDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  quarterlyProductPlanId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantityToProduce: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;
}
