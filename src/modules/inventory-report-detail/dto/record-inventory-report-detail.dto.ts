import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class RecordInventoryReportDetail {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note?: string;
}
