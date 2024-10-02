import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUomDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    return value.trim().toLowerCase();
  })
  name: string;
}
