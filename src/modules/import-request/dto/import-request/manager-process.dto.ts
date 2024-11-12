import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export enum ManagerAction {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ManagerProcessDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(ManagerAction)
  action: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  approveNote?: string;

  @ApiProperty({ required: false })
  rejectAt?: string | Date;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  rejectReason?: string;

  constructor() {
    this.rejectAt =
      this.action === ManagerAction.REJECTED ? new Date() : undefined;
  }

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.action === ManagerAction.APPROVED)
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  @IsNotEmpty()
  @IsUUID()
  warehouseStaffId: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.action === ManagerAction.APPROVED)
  @IsUserRoleExist(RoleCode.INSPECTION_DEPARTMENT)
  @IsNotEmpty()
  @IsUUID()
  inspectionDepartmentId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  InspectionNote?: string;
}
