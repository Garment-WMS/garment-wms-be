import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsDateString,
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
  @IsOptional()
  @IsEnum($Enums.InspectionRequestStatus)
  status: $Enums.InspectionRequestStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  createdAt?: string;
}
