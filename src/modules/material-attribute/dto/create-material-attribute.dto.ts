import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IsMaterialExist } from 'src/modules/material/validation/is-material-exist.validation';

export class CreateMaterialAttributeDto {
  @IsNotEmpty()
  @IsUUID()
  @IsMaterialExist()
  @ApiProperty()
  materialId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  @ApiProperty()
  value: any;
}
