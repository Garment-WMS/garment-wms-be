import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
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
  @IsInt()
  quantityToProduce: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;
}
