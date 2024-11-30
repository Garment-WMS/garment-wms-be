import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ProductionDepartmentApproveAction {
  PRODUCTION_APPROVE,
  PRODUCTION_REJECT,
}

export class ProductionStaffDepartmentDto {
  @ApiProperty()
  @IsEnum(ProductionDepartmentApproveAction)
  action: ProductionDepartmentApproveAction;

  @ApiProperty()
  @IsString()
  @IsOptional()
  productionRejectReason: string;
}
