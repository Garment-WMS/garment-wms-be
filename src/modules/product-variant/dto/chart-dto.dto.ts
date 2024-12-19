import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { IsYearFormat } from 'src/common/decorator/year-check.decorator';
import { IsProductExist } from '../validator/is-product-exist.validator';

export class ChartDto {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsProductExist({ each: true })
  productVariantId?: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsYearFormat()
  year: number;
}
