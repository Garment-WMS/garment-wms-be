import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  importReceiptId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  exportReceiptId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  materialExportReceiptId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  inspectionRequestId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  inventoryReportId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  inventoryReportPlanId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  warehouseStaffId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  inspectionDepartmentId?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum($Enums.TaskType)
  taskType: $Enums.TaskType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  staffNote?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum($Enums.TaskStatus)
  status: $Enums.TaskStatus = $Enums.TaskStatus.OPEN;
}
