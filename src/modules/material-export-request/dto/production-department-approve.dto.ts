import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsMaterialExportRequestExist } from '../validator/is-material-export-request-exist.validator';

export enum ProductionDepartmentApproveAction {
  PRODUCTION_APPROVED = 'PRODUCTION_APPROVED',
  PRODUCTION_REJECTED = 'PRODUCTION_REJECTED',
}

export class ProductionStaffDepartmentProcessDto {
  @ApiProperty()
  @IsUUID()
  @IsMaterialExportRequestExist()
  materialExportRequestId: string;

  @ApiProperty()
  @IsEnum(ProductionDepartmentApproveAction)
  action: ProductionDepartmentApproveAction;

  @ApiProperty()
  @IsString()
  @IsOptional()
  productionRejectReason: string;
}
