import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ManagerAction } from 'src/modules/import-request/dto/import-request/manager-process.dto';
import { CreateMaterialExportReceiptDto } from 'src/modules/material-export-receipt/dto/create-material-export-receipt.dto';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class ManagerApproveExportRequestDto {
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
  @IsNotEmpty()
  @ValidateIf((o) => o.action === ManagerAction.REJECTED)
  rejectionReason: string;

  @ApiProperty({ required: false })
  @IsString()
  managerNote: string;

  @ApiProperty({ required: false })
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  @IsUUID()
  @IsNotEmpty()
  warehouseStaffId: string;

  @ApiProperty({ required: false })
  @Type(() => CreateMaterialExportReceiptDto)
  @ValidateNested({ each: true })
  materialExportReceipt: CreateMaterialExportReceiptDto;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsNotEmpty()
  exportExpectedStartedAt: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsNotEmpty()
  exportExpectedFinishedAt: Date;
}
