import { RoleCode } from '@prisma/client';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class TestDto {
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  warehouseStaffId: string;
}
