import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { NestedCreateProductFormulaMaterialDto } from 'src/modules/product-formula-material/dto/nested-product-formula-material.dto';
import { IsProductSizeExist } from 'src/modules/product-size/validator/is-product-size-exist.validator';

export class CreateProductFormulaDto {
  // implements Prisma.ProductFormulaCreateInput
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsProductSizeExist()
  productSizeId: string;

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

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isBaseFormula: boolean;

  @ApiProperty({ type: [NestedCreateProductFormulaMaterialDto] })
  @IsOptional()
  @IsArray()
  @Type(() => NestedCreateProductFormulaMaterialDto)
  @ValidateNested({ each: true })
  productFormulaMaterials: NestedCreateProductFormulaMaterialDto[];
}
