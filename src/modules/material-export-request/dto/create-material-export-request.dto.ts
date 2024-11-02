import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma, RoleCode } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class CreateMaterialExportRequestDto
  implements Prisma.MaterialExportRequestUncheckedCreateInput
{
  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsUUID()
  // @IsProductionBatchExist()
  productionBatchId: string;

  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsUserRoleExist(RoleCode.WAREHOUSE_MANAGER)
  @IsUUID()
  warehouseManagerId: string;

  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  productionDepartmentId: string;

  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  @IsEnum($Enums.MaterialExportRequestStatus)
  status?: $Enums.MaterialExportRequestStatus;

  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  @IsString()
  description?: string;

  materialExportDetail?: Prisma.MaterialExportDetailCreateNestedManyWithoutMaterialExportRequestInput;
}
