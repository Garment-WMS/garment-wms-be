import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ManagerAction } from 'src/modules/import-request/dto/import-request/manager-process.dto';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class ManagerApproveExportRequestDto {
  @ApiProperty({ required: true })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ required: true })
  @IsUserRoleExist(RoleCode.WAREHOUSE_MANAGER)
  @IsUUID()
  @IsOptional()
  warehouseManagerId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(ManagerAction)
  action: ManagerAction;

  @ApiProperty({ required: false })
  @IsString()
  managerNote: string;

  @ApiProperty({ required: false })
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  @IsUUID()
  @IsNotEmpty()
  warehouseStaffId: string;
}
