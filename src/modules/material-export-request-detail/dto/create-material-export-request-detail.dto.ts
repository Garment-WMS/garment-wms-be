import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { IsMaterialVariantExist } from 'src/modules/material-variant/validation/is-material-exist.validation';

export class CreateMaterialExportRequestDetailDto {
  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsUUID()
  materialExportRequestId: string;

  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsMaterialVariantExist()
  @IsNotEmpty()
  @IsUUID()
  materialVariantId?: string;

  @ApiProperty({ required: true, type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantityByUom: number;
}
