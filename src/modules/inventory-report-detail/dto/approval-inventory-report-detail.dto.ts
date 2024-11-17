import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ApprovalInventoryReportDetailDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  managerQuantityConfirm: number;
}
