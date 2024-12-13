import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MinDate,
  ValidateIf,
} from 'class-validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';
import { IsImportRequestExist } from '../../validator/is-import-request-exist.validator';

export class ReassignImportRequestDto {
  @ApiProperty()
  @IsImportRequestExist()
  @IsUUID()
  importRequestId: string;

  @ApiProperty()
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  @IsOptional()
  @IsUUID()
  warehouseStaffId?: string;

  @ApiProperty()
  @IsUserRoleExist(RoleCode.INSPECTION_DEPARTMENT)
  @IsOptional()
  @IsUUID()
  inspectionDepartmentId?: string;

  @ApiProperty({ required: true, type: 'date' })
  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((o) => !!o.inspectionDepartmentId)
  inspectExpectedStartedAt?: Date;

  @ApiProperty({ required: true, type: 'date' })
  @IsDateString()
  @MinDate(new Date())
  @IsNotEmpty()
  @ValidateIf((o) => !!o.inspectionDepartmentId)
  inspectExpectedFinishedAt?: Date;

  @ApiProperty({ required: true, type: 'date' })
  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((o) => !!o.warehouseStaffId)
  importExpectedStartedAt?: Date;

  @ApiProperty({ required: true, type: 'date' })
  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((o) => !!o.warehouseStaffId)
  importExpectedFinishedAt?: Date;
}
