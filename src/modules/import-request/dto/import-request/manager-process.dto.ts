import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import {
  IsDateString,
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
  managerNote?: string;

  @ApiProperty({ required: false })
  rejectAt?: string | Date;

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

  @ApiProperty({ required: true, type: 'date' })
  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((o) => o.action === ManagerAction.APPROVED)
  inspectExpectedStartedAt: Date;

  @ApiProperty({ required: true, type: 'date' })
  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((o) => o.action === ManagerAction.APPROVED)
  inspectExpectedFinishedAt: Date;

  @ApiProperty({ required: true, type: 'date' })
  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((o) => o.action === ManagerAction.APPROVED)
  importExpectedStartedAt: Date;

  @ApiProperty({ required: true, type: 'date' })
  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((o) => o.action === ManagerAction.APPROVED)
  importExpectedFinishedAt: Date;
}
