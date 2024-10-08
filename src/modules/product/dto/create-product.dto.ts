import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';
import { IsProductTypeExist } from 'src/modules/product-type/validator/is-product-type-exist.validator';
import { IsProductUomExist } from 'src/modules/product-uom/validator/is-product-uom-exist.validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsProductTypeExist()
  productTypeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsProductUomExist()
  productUomId: string;

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
