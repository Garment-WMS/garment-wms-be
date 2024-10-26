import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IsMaterialTypeExist } from 'src/modules/material/validator/is-material-type-exist.validator';

export class CreateMaterialDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsUUID()
  @IsMaterialTypeExist()
  materialId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @ApiProperty({})
  @IsOptional()
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
