import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateImportRequestDetailDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  importRequestId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  materialId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty()
  @IsNumber()
  quantityByPack?: number;
}
