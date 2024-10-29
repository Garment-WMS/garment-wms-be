import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { IsImportReqStatusCanCreateInspectionReq } from 'src/modules/import-request/validator/is-import-req-can-create-inspetion-req';

export class CreateInspectionRequestDto {
  @ApiProperty({ required: true })
  @IsUUID()
  @IsImportReqStatusCanCreateInspectionReq()
  importRequestId: string;

  @ApiProperty({ required: true })
  @IsUUID()
  inspectionDepartmentId: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.warehouseManagerId === undefined)
  @IsUUID()
  purchasingStaffId: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.purchasingStaffId === undefined)
  @IsUUID()
  warehouseManagerId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  note?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsEnum($Enums.InspectionRequestStatus)
  status: $Enums.InspectionRequestStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  createdAt?: string;
}
