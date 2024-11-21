import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IsMaterialVariantExist } from 'src/modules/material-variant/validation/is-material-exist.validation';

export class CreateMaterialAttributeDto {
  @IsNotEmpty()
  @IsUUID()
  @IsMaterialVariantExist()
  @ApiProperty()
  materialVariantId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  @ApiProperty()
  value: any;
}
