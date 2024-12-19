import { ApiProperty } from '@nestjs/swagger';
import { $Enums, RoleCode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';
import { CreateImportRequestDetailDto } from '../import-request-detail/create-import-request-detail.dto';

export class CreateProductImportRequestDto {
  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  @IsUserRoleExist(RoleCode.WAREHOUSE_MANAGER)
  warehouseManagerId?: string;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  @IsUserRoleExist(RoleCode.PRODUCTION_DEPARTMENT)
  productionDepartmentId?: string;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  warehouseStaffId?: string;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  // @IsPoDeliveryDoesNotHaveActiveImportRequest()
  productionBatchId: string;

  //tips: @IsEnum(type) and @ApiProperty(type) cause dependency cycle
  @ApiProperty({ required: false })
  @IsEnum($Enums.ImportRequestStatus)
  @IsOptional()
  status?: $Enums.ImportRequestStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

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
  // @IsImportRequestDetailMatchType()
  @IsNotEmpty()
  @Type(() => CreateImportRequestDetailDto)
  importRequestDetail: CreateImportRequestDetailDto;

  @ApiProperty({ required: true, type: 'string' })
  @IsEnum($Enums.ImportRequestType)
  type: $Enums.ImportRequestType;
}
