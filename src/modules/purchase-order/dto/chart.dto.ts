import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { IsYearFormat } from 'src/common/decorator/year-check.decorator';

export class ChartDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsYearFormat()
  year: number;
}
