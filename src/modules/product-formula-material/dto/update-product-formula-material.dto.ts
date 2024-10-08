import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateProductFormulaMaterialDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  quantityByUom: number;
}
