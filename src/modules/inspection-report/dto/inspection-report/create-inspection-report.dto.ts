import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UniqueInArray } from 'src/common/decorator/validator/unique-property.decorator';
import { IsInspectionRequestExist } from 'src/modules/inspection-request/validator/is-inspection-request-exist.validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';
import { CreateInspectionReportDetailDto } from '../inspection-report-detail/create-inspection-report-detail.dto';

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

  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsUUID()
  @IsUserRoleExist(RoleCode.INSPECTION_DEPARTMENT)
  inspectionDepartmentId: string;

  @ApiProperty({ required: true, type: [CreateInspectionReportDetailDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateInspectionReportDetailDto)
  @IsArray()
  @UniqueInArray(['materialVariantId', 'productVariantId'])
  inspectionReportDetail: CreateInspectionReportDetailDto[];
}
