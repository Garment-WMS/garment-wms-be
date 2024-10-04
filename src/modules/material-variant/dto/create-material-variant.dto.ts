import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
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
  @IsNumber()
  uomPerPack: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  packedWidth: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  packedHeight: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  packedLength: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  packedWeight: number;
}
