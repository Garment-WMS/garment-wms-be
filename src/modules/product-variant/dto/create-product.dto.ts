import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';
import { IsProductTypeExist } from 'src/modules/product/validator/is-product-type-exist.validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsProductTypeExist()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  code: string;
}
