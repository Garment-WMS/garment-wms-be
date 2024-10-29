import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Min, ValidateIf } from 'class-validator';
import { IsMaterialPackageExist } from 'src/modules/material-package/validator/is-material-package-exist.validator';
import { IsProductSizeExist } from 'src/modules/product-size/validator/is-product-size-exist.validator';

export class CreateImportRequestDetailDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  importRequestId: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.productIdSizeId === undefined)
  @IsUUID()
  @IsMaterialPackageExist()
  materialPackageId?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.materialPackageId === undefined)
  @IsUUID()
  @IsProductSizeExist()
  productIdSizeId?: string;

  @ApiProperty({ required: true })
  @IsInt()
  @Min(1)
  quantityByPack: number;
}
