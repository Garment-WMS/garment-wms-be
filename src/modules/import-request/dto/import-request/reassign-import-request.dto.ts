import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { IsUUID } from 'class-validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';
import { IsImportRequestExist } from '../../validator/is-import-request-exist.validator';

export class ReassignImportRequestDto {
  @ApiProperty()
  @IsImportRequestExist()
  @IsUUID()
  importRequestId: string;

  @ApiProperty()
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  @IsUUID()
  warehouseStaffId: string;
}
