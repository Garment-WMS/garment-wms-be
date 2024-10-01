import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsUUID()
  materialTypeId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsUUID()
  packagingUnitId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsUUID()
  uomId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  uomPerPackagingUnit: number;

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
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  height: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  length: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minQuantity: number;
}
