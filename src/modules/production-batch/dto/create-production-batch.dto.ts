import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { IsProductionPlanDetailExist } from 'src/modules/product-plan-detail/validator/is-production-plan-detail-exist.validator';
import { CreateProductionBatchMaterialVariantDto } from 'src/modules/production-batch-material-variant/dto/create-production-batch-material-variant.dto';

export class CreateProductionBatchDto
  implements Prisma.ProductionBatchUncheckedCreateInput
{
  @ApiProperty({ required: true })
  @IsUUID()
  @IsProductionPlanDetailExist()
  productionPlanDetailId: string;

  code: string = undefined;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: true })
  @IsInt()
  @Min(1)
  quantityToProduce: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string | Date = new Date();

  @ApiProperty({ required: false })
  @IsDateString()
  expectedFinishDate?: string | Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productionBatchMaterials: CreateProductionBatchMaterialVariantDto[];
}
