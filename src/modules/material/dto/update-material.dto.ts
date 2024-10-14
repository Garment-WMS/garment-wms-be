import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMaterialDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  image;
}
