import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsProductExist } from 'src/modules/product-variant/validator/is-product-exist.validator';

export class CreateProductVariantDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsProductExist()
  productVariantId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  width: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  length: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  size: string;
}
