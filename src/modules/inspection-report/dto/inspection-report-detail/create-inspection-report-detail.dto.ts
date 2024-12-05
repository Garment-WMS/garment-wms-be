import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { AtLeastOneExists } from 'src/common/pipe/at-least-one-exist.pipe';
import { IsMaterialPackageExist } from 'src/modules/material-package/validator/is-material-package-exist.validator';
import { IsProductSizeExist } from 'src/modules/product-size/validator/is-product-size-exist.validator';
import { IsInspectionReportNotExist } from '../../validator/is-inspection-report-not-exist.validator';
import { CreateInspectionReportDetailDefectDto } from '../inspection-report-detail-defect/inspection-report-detail-defect.dto';

export class CreateInspectionReportDetailDto {
  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  @IsInspectionReportNotExist()
  inspectionReportId?: string;

  @ApiProperty({ required: true, type: 'number' })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantityByPack: number;

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
  materialPackageId?: string;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsOptional()
  @ValidateIf(
    (o: CreateInspectionReportDetailDto, v) =>
      o.materialPackageId === undefined,
  )
  @IsUUID()
  @IsProductSizeExist()
  productSizeId?: string;

  @ApiProperty({ required: false, type: 'array', items: { type: 'object' } })
  @ValidateNested({ each: true })
  @Type(() => CreateInspectionReportDetailDefectDto)
  @ArrayUnique((o) => o.defectId)
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  //this does not work because of the condition count for other item in array
  // @ValidateIf(
  //   (o: CreateInspectionReportDetailDto) => o.defectQuantityByPack > 0,
  // )
  inspectionReportDetailDefect?: CreateInspectionReportDetailDefectDto[];
}
