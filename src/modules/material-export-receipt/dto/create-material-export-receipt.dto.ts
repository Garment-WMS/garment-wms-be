import { ApiProperty } from '@nestjs/swagger';
import { $Enums, RoleCode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { NestCreateMaterialExportReceipt } from 'src/modules/material-export-receipt-detail/dto/nested-create-material-export-receipt.dto';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class CreateMaterialExportReceiptDto {
  // implements Prisma.MaterialExportReceiptCreateInput
  @ApiProperty()
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  @IsUUID()
  warehouseStaffId: string;

  @ApiProperty()
  @IsString()
  note: string;

  @ApiProperty()
  @IsEnum($Enums.MaterialExportReceiptType)
  type: $Enums.MaterialExportReceiptType;

  @ApiProperty()
  @Type(() => NestCreateMaterialExportReceipt)
  @ValidateNested({
    each: true,
  })
  @ArrayUnique((o) => o.materialReceiptId)
  @IsArray()
  materialExportReceiptDetail: NestCreateMaterialExportReceipt[];
}
