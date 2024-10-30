import { ApiProperty } from '@nestjs/swagger';
import { ReceiptType, RoleCode } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinDate,
  ValidateNested,
} from 'class-validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';
import { MaterialImportReceiptDto } from './material-import-receipt.dto';

export class CreateImportReceiptDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  importRequestId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  warehouseStaffId: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => MaterialImportReceiptDto)
  // materialReceipts: MaterialImportReceiptDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ReceiptType)
  type: ReceiptType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  startAt: Date;
  finishAt: Date;
}
