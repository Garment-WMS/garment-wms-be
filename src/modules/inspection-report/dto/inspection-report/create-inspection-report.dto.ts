import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UniqueInArray } from 'src/common/decorator/validator/unique-property.decorator';
import { IsInspectionRequestExist } from 'src/modules/inspection-request/validator/is-inspection-request-exist.validator';
import { CreateInspectionReportDetailDto } from '../inspection-report-detail/create-inspection-report-detail.dto';
import { IsMaterialPackageOrProductSizeNotNullByType } from './is-material-package-or-product-size-not-null-by-type';

export class CreateInspectionReportDto {
  // implements Prisma.InspectionReportUncheckedCreateInput
  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsInspectionRequestExist()
  @IsUUID('4')
  inspectionRequestId: string;

  // @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  // @IsUUID()
  // @IsUserRoleExist(RoleCode.INSPECTION_DEPARTMENT)
  // inspectionDepartmentId: string;

  @ApiProperty({ required: true, type: [CreateInspectionReportDetailDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateInspectionReportDetailDto)
  @IsArray()
  @UniqueInArray(['materialVariantId', 'productVariantId'])
  @IsMaterialPackageOrProductSizeNotNullByType()
  inspectionReportDetail: CreateInspectionReportDetailDto[];

  @IsString()
  @IsNotEmpty()
  @IsEnum($Enums.InspectionReportType)
  type?: $Enums.InspectionReportType;
}
