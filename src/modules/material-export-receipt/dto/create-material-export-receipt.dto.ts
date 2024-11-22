import { ApiProperty } from '@nestjs/swagger';
import { $Enums, RoleCode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { NestCreateMaterialExportReceipt } from 'src/modules/material-export-receipt-detail/dto/nested-create-material-export-receipt.dto';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class CreateMaterialExportReceiptDto {
  // implements Prisma.MaterialExportReceiptCreateInput
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  materialExportRequestId: string;

  @ApiProperty()
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  @IsUUID()
  @IsOptional()
  warehouseStaffId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty()
  @IsEnum($Enums.MaterialExportReceiptType)
  @IsOptional()
  type: $Enums.MaterialExportReceiptType;

  @ApiProperty()
  @ValidateNested({
    each: true,
  })
  @ArrayUnique((o) => o.materialReceiptId, {
    message: 'Material receipt id must be unique in array',
  })
  @Type(() => NestCreateMaterialExportReceipt)
  @IsArray()
  materialExportReceiptDetail: NestCreateMaterialExportReceipt[];
}
