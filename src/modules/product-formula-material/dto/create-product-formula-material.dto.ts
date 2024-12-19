import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import { IsMaterialVariantExist } from 'src/modules/material-variant/validation/is-material-exist.validation';

export class CreateProductFormulaMaterialDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  productFormulaId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsMaterialVariantExist()
  materialVariantId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  quantityByUom: number;
}
