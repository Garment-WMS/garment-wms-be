import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { IsMaterialExportRequestExist } from 'src/modules/material-export-request/validator/is-material-export-request-exist.validator';
import { IsProductFormulaExist } from 'src/modules/product-formula/validator/is-product-formula-exist.validator';
import { ExportAlgorithmEnum } from '../enum/export-algorithm.enum';

export class GetRecommendMaterialExportReceiptDto {
  @ApiProperty({ required: true })
  @IsEnum(ExportAlgorithmEnum)
  @IsNotEmpty()
  algorithm: ExportAlgorithmEnum;

  @ApiProperty({ required: true })
  @IsMaterialExportRequestExist()
  @IsUUID()
  @IsNotEmpty()
  materialExportRequestId: string;
}

export class GetRecommendMaterialExportReceiptTestDto {
  @ApiProperty({ required: true })
  @IsEnum(ExportAlgorithmEnum)
  @IsNotEmpty()
  algorithm: ExportAlgorithmEnum;

  @ApiProperty({ required: true })
  @IsProductFormulaExist()
  @IsUUID()
  @IsNotEmpty()
  productFormulaId: string;

  @ApiProperty({ required: true })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantityToProduce: number;
}
