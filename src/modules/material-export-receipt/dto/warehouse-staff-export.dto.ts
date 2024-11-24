import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { IsMaterialExportRequestExist } from 'src/modules/material-export-request/validator/is-material-export-request-exist.validator';
export enum WarehouseStaffExportAction {
  EXPORTING = 'EXPORTING',
  EXPORTED = 'EXPORTED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
}

export class WarehouseStaffExportDto {
  @ApiProperty()
  @IsEnum(WarehouseStaffExportAction)
  action: WarehouseStaffExportAction;

  @ApiProperty()
  @IsUUID()
  @IsMaterialExportRequestExist()
  materialExportRequestId: string;

  // @ApiProperty()
  // @IsUUID()
  // @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  // @IsOptional()
  // warehouseStaffId: string;
}
