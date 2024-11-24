import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { IsMaterialExportRequestExist } from 'src/modules/material-export-request/validator/is-material-export-request-exist.validator';

export enum ProductionStaffCApproveAction {
  PRODUCTION_APPROVED = 'PRODUCTION_APPROVED',
  PRODUCTION_REJECTED = 'PRODUCTION_REJECTED',
}
export class ProductionStaffApproveDto {
  @ApiProperty()
  @IsEnum(ProductionStaffCApproveAction)
  action: ProductionStaffCApproveAction;

  @ApiProperty()
  @IsUUID()
  @IsMaterialExportRequestExist()
  materialExportRequestId: string;
}
