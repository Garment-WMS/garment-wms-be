import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateImportRequestDetailDto } from '../import-request-detail/create-import-request-detail.dto';

export class CreateImportRequestDto {
  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  warehouseStaffId?: string;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  poDeliveryId: string;

  //tips: @IsEnum(type) and @ApiProperty(type) cause dependency cycle
  @ApiProperty({ required: false })
  @IsEnum($Enums.ImportRequestStatus)
  @IsOptional()
  status?: $Enums.ImportRequestStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  from?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  to?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startAt?: string | Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  finishAt?: string | Date;

  @ApiProperty({ required: true, type: [Object] })
  importRequestDetails: CreateImportRequestDetailDto[];
}
