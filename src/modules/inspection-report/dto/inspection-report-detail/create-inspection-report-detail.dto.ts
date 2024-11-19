import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsOptional, IsUUID, ValidateIf } from 'class-validator';
import { AtLeastOneExists } from 'src/common/pipe/at-least-one-exist.pipe';
import { IsMaterialPackageExist } from 'src/modules/material-package/validator/is-material-package-exist.validator';
import { IsProductSizeExist } from 'src/modules/product-size/validator/is-product-size-exist.validator';
import { IsInspectionReportNotExist } from '../../validator/is-inspection-report-not-exist.validator';

export class CreateInspectionReportDetailDto
  implements Prisma.InspectionReportDetailCreateWithoutInspectionReportInput
{
  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  @IsInspectionReportNotExist()
  inspectionReportId: string;

  @ApiProperty({ required: true, type: 'number' })
  @IsOptional()
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
    (o: CreateInspectionReportDetailDto, v) => o.productSizeId === undefined,
  )
  @IsUUID()
  @IsMaterialPackageExist()
  @AtLeastOneExists(['materialPackageId', 'productSizeId'])
  materialPackageId: string;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsOptional()
  @ValidateIf(
    (o: CreateInspectionReportDetailDto, v) =>
      o.materialPackageId === undefined,
  )
  @IsUUID()
  @IsProductSizeExist()
  productSizeId: string;
}
