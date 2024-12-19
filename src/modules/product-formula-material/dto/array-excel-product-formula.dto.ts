import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Min } from 'class-validator';
import { IsMaterialVariantExist } from 'src/modules/material-variant/validation/is-material-exist.validation';

export class ArrayExcelProductFormula {
  @ApiProperty()
  @IsUUID()
  @IsMaterialVariantExist()
  materialVariantId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantityByUom: number;
}
