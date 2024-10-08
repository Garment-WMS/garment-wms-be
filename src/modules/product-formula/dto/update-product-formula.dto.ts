import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateProductFormulaDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  quantityRangeStart: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  quantityRangeEnd: number;
}
