import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IsMaterialTypeExist } from 'src/modules/material-type/validator/is-material-type-exist.validator';
import { IsUomExist } from 'src/modules/uom/validation/is-uom-exist.validation';

export class CreateMaterialDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsUUID()
  @IsMaterialTypeExist()
  materialTypeId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsUUID()
  @IsUomExist()
  materialUomId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  code: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  reorderLevel: number;
}
