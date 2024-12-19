import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  NotEquals,
} from 'class-validator';
import { IsMaterialVariantExist } from 'src/modules/material-variant/validation/is-material-exist.validation';

export class CreateMaterialPackageDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsUUID()
  @IsMaterialVariantExist()
  materialVariantId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  packUnit: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsInt()
  uomPerPack: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  @Min(0)
  packedWidth: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  @Min(0)
  packedHeight: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  @Min(0)
  packedLength: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  @Min(0)
  packedWeight: number;
}
