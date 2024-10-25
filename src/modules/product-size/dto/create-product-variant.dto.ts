import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IsProductExist } from 'src/modules/product-variant/validator/is-product-exist.validator';

export class CreateProductVariantDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsProductExist()
  productVariantId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  width: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  height: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  length: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  weight: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  size: string;
}
