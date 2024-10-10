import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateInspectionRequestDto {
  @ApiProperty({ required: true })
  @IsUUID()
  importRequestId: string;

  @ApiProperty({ required: true })
  @IsUUID()
  inspectionDepartmentId: string;

  @ApiProperty({ required: true })
  @IsUUID()
  purchasingStaffId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  note?: string;

  @ApiProperty({ required: true })
  @IsEnum($Enums.InspectionRequestStatus)
  status: $Enums.InspectionRequestStatus;
}
