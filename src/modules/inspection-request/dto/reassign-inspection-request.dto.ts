import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { IsUUID } from 'class-validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';
import { IsInspectionRequestExist } from '../validator/is-inspection-request-exist.validator';

export class ReassignImportRequestDto {
  @ApiProperty()
  @IsInspectionRequestExist()
  @IsUUID()
  importRequestId: string;

  @ApiProperty()
  @IsUserRoleExist(RoleCode.INSPECTION_DEPARTMENT)
  @IsUUID()
  inspectionDepartmentId: string;
}
