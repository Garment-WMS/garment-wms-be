import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsOptional, IsUUID, ValidateIf } from 'class-validator';
import { IsMaterialVariantExist } from 'src/modules/material-variant/validator/is-material-variant-exist.validator';
import { IsProductVariantExist } from 'src/modules/product-variant/validator/is-product-variant-exist.validator';

export class CreateInspectionReportDetailDto
  implements Prisma.InspectionReportDetailCreateWithoutInspectionReportInput
{
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  inspectionReportId: string;

  @ApiProperty({ required: true, type: 'number' })
  @IsInt()
  quantityByPack?: number;

  @ApiProperty({ required: true, type: 'number' })
  @IsInt()
  approvedQuantityByPack: number;

  @ApiProperty({ required: true, type: 'number' })
  @IsInt()
  defectQuantityByPack: number;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsOptional()
  @ValidateIf(
    (o: CreateInspectionReportDetailDto, v) => o.productVariantId === undefined,
  )
  @IsUUID()
  @IsMaterialVariantExist()
  materialVariantId: string;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsOptional()
  @ValidateIf(
    (o: CreateInspectionReportDetailDto, v) =>
      o.materialVariantId === undefined,
  )
  @IsUUID()
  @IsProductVariantExist()
  productVariantId: string;
}
