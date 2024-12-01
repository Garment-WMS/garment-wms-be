import { ApiProperty } from '@nestjs/swagger';
import { ReceiptType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
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
  startAt?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  expectedStartAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  finishAt?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  expectedFinishAt: Date;
}
