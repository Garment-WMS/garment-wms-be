import { ImportRequestStatus, ImportRequestType, Prisma } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { FilterDto } from 'src/common/dto/filter-query.dto';

export class SearchImportQueryDto extends FilterDto<Prisma.ImportRequestWhereInput> {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsEnum(ImportRequestType)
  type?: ImportRequestType;

  @IsOptional()
  @IsUUID()
  warehouseManagerId?: string;

  @IsOptional()
  @IsUUID()
  purchasingStaffId?: string;

  @IsOptional()
  @IsUUID()
  warehouseStaffId?: string;

  @IsOptional()
  @IsUUID()
  poDeliveryId?: string;

  @IsOptional()
  @IsEnum(ImportRequestStatus)
  status?: ImportRequestStatus;
}
