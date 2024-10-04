import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMaterialVariantDto {
  @ApiProperty({})
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  packUnit?: string;
}
