import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class CreateInventoryReportDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  inventoryReportPlanDetailId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  productSizeId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  materialPackageId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  warehouseStaffId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;
}
