import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AtLeastOneExists } from 'src/common/pipe/at-least-one-exist.pipe';
import { IsMaterialPackageExist } from 'src/modules/material-package/validator/is-material-package-exist.validator';
import { IsProductSizeExist } from 'src/modules/product-size/validator/is-product-size-exist.validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class CreateInventoryReportPlanDetailDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  @IsProductSizeExist()
  productSizeId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  @IsMaterialPackageExist()
  materialPackageId?: string;

  @AtLeastOneExists('productSizeId', 'materialPackageId', {})
  dummyField?: string;

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
