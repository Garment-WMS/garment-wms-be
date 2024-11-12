import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { IsProductionPlanDetailExist } from 'src/modules/product-plan-detail/validator/is-production-plan-detail-exist.validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class UpdateProductionBatchDto
  implements Prisma.ProductionBatchUncheckedUpdateInput
{
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  @IsProductionPlanDetailExist()
  productionPlanDetailId: string;

  code: string = undefined;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantityToProduce?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string | Date;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsDateString()
  expectedFinishDate?: string | Date;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsDateString()
  finishedDate?: string | Date;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsDateString()
  canceledAt?: string | Date;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsUUID()
  @IsUserRoleExist($Enums.RoleCode.PRODUCTION_DEPARTMENT)
  canceledBy?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  canceledReason?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsEnum($Enums.ProductionBatchStatus)
  status?: $Enums.ProductionBatchStatus;
}
