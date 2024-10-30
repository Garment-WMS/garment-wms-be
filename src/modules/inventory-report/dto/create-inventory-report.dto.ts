import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AtLeastOneExists } from 'src/common/pipe/at-least-one-exist.pipe';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class CreateInventoryReportDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  productVariantId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  materialVariantId: string;

  @AtLeastOneExists('productVariantId', 'materialVariantId')
  dummyField: string; // This field is just a placeholder for the custom validation

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
