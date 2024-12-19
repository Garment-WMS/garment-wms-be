import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CheckQuantityVariantDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  materialVariantId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  quantityByUom: number;
}
