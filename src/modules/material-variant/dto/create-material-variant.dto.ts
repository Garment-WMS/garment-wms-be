import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  NotEquals,
} from 'class-validator';
import { IsMaterialExist } from 'src/modules/material/validation/is-material-exist.validation';

export class CreateMaterialVariantDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsUUID()
  @IsMaterialExist()
  materialId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({})
  @IsNotEmpty()
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
  @IsInt()
  @NotEquals(0)
  @Min(0)
  packedWidth: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  @Min(0)
  packedHeight: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  @Min(0)
  packedLength: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  @Min(0)
  packedWeight: number;
}
