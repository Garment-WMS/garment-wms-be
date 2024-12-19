import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsMaterialVariantExist } from 'src/modules/material-variant/validation/is-material-exist.validation';
import { IsProductExist } from 'src/modules/product-variant/validator/is-product-exist.validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class CreateInventoryReportPlanDetailDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  @IsProductExist()
  productVariantId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  @IsMaterialVariantExist()
  materialVariantId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  warehouseStaffId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note?: string;
}
