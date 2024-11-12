import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { IsYearFormat } from 'src/common/decorator/year-check.decorator';
import { IsMaterialExist } from '../validation/is-material-exist.validation';

export class ChartDto {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsMaterialExist({ each: true })
  materialVariantId?: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsYearFormat()
  year: number;
}
