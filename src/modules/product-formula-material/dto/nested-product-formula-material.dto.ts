import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { IsMaterialVariantExist } from 'src/modules/material-variant/validation/is-material-exist.validation';
import { IsProductFormulaExist } from 'src/modules/product-formula/validator/is-product-formula-exist.validator';

export class NestedCreateProductFormulaMaterialDto
  implements Prisma.ProductFormulaMaterialUncheckedCreateInput
{
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  @IsProductFormulaExist()
  productFormulaId: string;

  @ApiProperty()
  @IsUUID()
  @IsMaterialVariantExist()
  materialVariantId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantityByUom: number;
}
