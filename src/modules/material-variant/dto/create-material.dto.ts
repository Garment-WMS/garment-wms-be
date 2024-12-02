import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateMaterialAttributeDto } from 'src/modules/material-attribute/dto/create-material-attribute.dto';
import { CreateMaterialPackageDto } from 'src/modules/material-package/dto/create-material-variant.dto';
import { IsMaterialTypeExist } from 'src/modules/material/validator/is-material-type-exist.validator';
import { NestedMaterialPackageDto } from './nested-material-package.dto';
import { NestedMaterialAttributeDto } from './nested-material-attribute.dto';

export class CreateMaterialDto {
  @ApiProperty({})
  @IsNotEmpty()
  // @IsUUID()
  // @IsMaterialTypeExist()
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

  @ApiProperty({})
  @IsOptional()
  @IsArray()
  @Type(() => NestedMaterialPackageDto)
  @ValidateNested({ each: true })
  materialPackages?: NestedMaterialPackageDto[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => NestedMaterialAttributeDto)
  @ValidateNested({ each: true })
  materialAttributes?: NestedMaterialAttributeDto[];
}
