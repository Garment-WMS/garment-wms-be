import { ApiProperty } from '@nestjs/swagger';
import { $Enums, RoleCode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
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
import { IsPoDeliveryExist } from 'src/modules/po-delivery/validator/is-po-delivery-exist.validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';
import { IsImportRequestDetailMatchType } from '../../validator/is-import-request-detail-match-type';
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
  @IsUserRoleExist(RoleCode.PRODUCTION_DEPARTMENT)
  productionDepartmentId?: string;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  warehouseStaffId?: string;

  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsPoDeliveryExist()
  // @IsPoDeliveryDoesNotHaveActiveImportRequest()
  poDeliveryId: string;

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
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsImportRequestDetailMatchType()
  @UniqueInArray(['materialPackageId', 'productIdSizeId'])
  @Type(() => CreateImportRequestDetailDto)
  importRequestDetails: CreateImportRequestDetailDto[];

  @ApiProperty({ required: true, type: 'string' })
  @IsEnum($Enums.ImportRequestType)
  type: $Enums.ImportRequestType;
}
