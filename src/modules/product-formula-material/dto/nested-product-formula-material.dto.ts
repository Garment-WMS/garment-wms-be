import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import { IsMaterialExist } from 'src/modules/material-variant/validation/is-material-exist.validation';

export class NestedCreateProductFormulaMaterialDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsMaterialExist()
  materialId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  quantityByUom: number;

  productFormulaId: string;
}
