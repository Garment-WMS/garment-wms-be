import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateProductPlanDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  productSizeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantityToProduce: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  note: string;
}
