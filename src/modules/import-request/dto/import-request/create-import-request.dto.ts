import { ApiProperty } from '@nestjs/swagger';
import { $Enums, RoleCode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UniqueInArray } from 'src/common/decorator/validator/unique-property.decorator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';
import { CreateImportRequestDetailDto } from '../import-request-detail/create-import-request-detail.dto';

export class CreateImportRequestDto {
  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  @IsUserRoleExist(RoleCode.WAREHOUSE_MANAGER)
  warehouseManagerId?: string;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  @IsUserRoleExist(RoleCode.PURCHASING_STAFF)
  purchasingStaffId?: string;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
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
  @IsDateString()
  @IsOptional()
  startAt?: string | Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  finishAt?: string | Date;

  @ApiProperty({ required: true, type: [CreateImportRequestDetailDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @UniqueInArray(['materialVariantId'])
  @Type(() => CreateImportRequestDetailDto)
  importRequestDetails: CreateImportRequestDetailDto[];

  @ApiProperty({ required: true, type: 'string' })
  @IsEnum($Enums.ImportRequestType)
  type: $Enums.ImportRequestType;
}
