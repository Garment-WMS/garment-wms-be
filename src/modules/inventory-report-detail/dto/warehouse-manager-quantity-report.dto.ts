import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { WarehouseManagerApprovalInventoryReportDetailDto } from './warehouse-manager-approval-inventory-report-detail.dto';

export class WarehouseManagerQuantityReportDetails {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WarehouseManagerApprovalInventoryReportDetailDto)
  details: WarehouseManagerApprovalInventoryReportDetailDto[];
}
