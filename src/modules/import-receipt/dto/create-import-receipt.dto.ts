import { ApiProperty } from '@nestjs/swagger';
import { ReceiptType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinDate,
} from 'class-validator';

export class CreateImportReceiptDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  importRequestId: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsUUID()
  // @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  // warehouseStaffId: string;

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
  note?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  startAt: Date;
  finishAt?: Date;
}
