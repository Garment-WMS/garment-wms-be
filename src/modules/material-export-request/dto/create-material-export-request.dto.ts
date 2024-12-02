import { ApiProperty } from '@nestjs/swagger';
import { $Enums, RoleCode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateNestedMaterialExportRequestDetailDto } from 'src/modules/material-export-request-detail/dto/create-nested-material-export-request-detail.dto';
import { IsProductionBatchExist } from 'src/modules/production-batch/validator/is-production-batch-exist.validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class CreateMaterialExportRequestDto {
  // implements Prisma.MaterialExportRequestUncheckedCreateInput

  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsProductionBatchExist()
  productionBatchId: string;

  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsUserRoleExist(RoleCode.WAREHOUSE_MANAGER)
  @IsUUID()
  @IsOptional()
  warehouseManagerId: string;

  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsUserRoleExist(RoleCode.PRODUCTION_DEPARTMENT)
  @IsUUID()
  @IsOptional()
  productionDepartmentId: string;

  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  @IsEnum($Enums.MaterialExportRequestStatus)
  status?: $Enums.MaterialExportRequestStatus;

  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: true,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        materialId: { type: 'string', format: 'uuid' },
        quantityByUom: { type: 'number' },
      },
      required: ['materialId', 'quantityByUom'],
    },
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateNestedMaterialExportRequestDetailDto)
  @ArrayUnique((o) => o.materialVariantId)
  @ArrayNotEmpty()
  @IsArray()
  @IsOptional()
  materialExportRequestDetail?: CreateNestedMaterialExportRequestDetailDto[];
}
