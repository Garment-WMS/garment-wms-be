import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUomDto {
  @ApiProperty({})
  @IsOptional()
  @IsString()
  name?: string;
}
