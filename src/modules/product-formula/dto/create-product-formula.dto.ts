import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { NestedCreateProductFormulaMaterialDto } from 'src/modules/product-formula-material/dto/nested-product-formula-material.dto';
import { IsProductVariantExist } from 'src/modules/product-size/validator/is-product-variant-exist.validator';

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

  @ApiProperty({ type: [NestedCreateProductFormulaMaterialDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NestedCreateProductFormulaMaterialDto)
  productFormulaMaterials: NestedCreateProductFormulaMaterialDto[];
}
