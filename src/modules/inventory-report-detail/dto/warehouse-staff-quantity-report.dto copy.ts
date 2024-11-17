import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { WarehouseStaffApprovalInventoryReportDetailDto } from './warehouse-staff-approval-inventory-report-detail.dto';
import { Type } from 'class-transformer';

export class WarehouseStaffQuantityReportDetails {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WarehouseStaffApprovalInventoryReportDetailDto)
  details: WarehouseStaffApprovalInventoryReportDetailDto[];
}
