import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { IsMaterialExist } from 'src/modules/material/validation/is-material-exist.validation';

export class CreateImportRequestDetailDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  importRequestId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  @IsMaterialExist()
  materialId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty()
  @IsNumber()
  quantityByPack?: number;
}
