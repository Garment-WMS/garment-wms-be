import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateProductFormulaMaterialDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  quantityByUom: number;
}
