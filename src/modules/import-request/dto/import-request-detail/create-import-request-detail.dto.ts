import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID, ValidateIf } from 'class-validator';
import { IsMaterialVariantExist } from 'src/modules/material-variant/validator/is-material-variant-exist.validator';

export class CreateImportRequestDetailDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  importRequestId: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.productId === undefined)
  @IsUUID()
  @IsMaterialVariantExist()
  materialVariantId?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.materialVariantId === undefined)
  @IsUUID()
  productId?: string;

  @ApiProperty()
  @IsNumber()
  quantityByPack?: number;
}
