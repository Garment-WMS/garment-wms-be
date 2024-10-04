import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateImportRequestDetailDto } from '../import-request-detail/create-import-request-detail.dto';

export class CreateImportRequestDto
  implements Prisma.ImportRequestUncheckedCreateInput
{
  id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
  cancelAt?: string | Date;
  rejectAt?: string | Date;
  import_request_type: $Enums.ImportRequestType;
  importRequestDetail?: Prisma.ImportRequestDetailUncheckedCreateNestedManyWithoutImportRequestInput;
  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  warehouseManagerId?: string;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  purchasingStaffId?: string;

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
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  rejectReason?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  cancelReason?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  from?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
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
  @ValidateNested()
  @Type(() => CreateImportRequestDetailDto)
  importRequestDetails: CreateImportRequestDetailDto[];

  @ApiProperty({ required: true, type: 'string' })
  @IsEnum($Enums.ImportRequestType)
  type: $Enums.ImportRequestType;
}
