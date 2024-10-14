import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  productTypeId?: string;
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  productUomId?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  code?: string;

  image;
}
