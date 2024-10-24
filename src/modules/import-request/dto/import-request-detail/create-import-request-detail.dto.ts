import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { IsMaterialVariantExist } from 'src/modules/material-package/validator/is-material-variant-exist.validator';
import { IsProductVariantExist } from 'src/modules/product-size/validator/is-product-variant-exist.validator';

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
  @ArrayUnique()
  @IsProductVariantExist()
  productIdVariantId?: string;

  @ApiProperty({ required: true })
  @IsInt()
  @Min(1)
  quantityByPack: number;
}
