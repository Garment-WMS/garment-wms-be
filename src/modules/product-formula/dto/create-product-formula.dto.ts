import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';
import { IsProductVariantExist } from 'src/modules/product-variant/validator/is-product-variant-exist.validator';

export class CreateProductFormulaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsProductVariantExist()
  productVariantId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantityRangeStart: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantityRangeEnd: number;
}
