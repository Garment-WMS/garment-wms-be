import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { IsMaterialExist } from 'src/modules/material/validation/is-material-exist.validation';

export class NestedCreateProductFormulaMaterialDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsMaterialExist()
  materialId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantityByUom: number;

  productFormulaId: string;
}
