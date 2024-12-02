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
import { UniqueInArray } from 'src/common/decorator/validator/unique-property.decorator';
import { IsMaterialTypeExist } from 'src/modules/material/validator/is-material-type-exist.validator';
import { NestedMaterialAttributeDto } from './nested-material-attribute.dto';
import { NestedMaterialPackageDto } from './nested-material-package.dto';

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

  @ApiProperty({})
  @IsOptional()
  @IsArray()
  @Type(() => NestedMaterialPackageDto)
  @ValidateNested({ each: true })
  @UniqueInArray(['name'])
  materialPackages?: NestedMaterialPackageDto[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => NestedMaterialAttributeDto)
  @ValidateNested({ each: true })
  @UniqueInArray(['name'])
  materialAttributes?: NestedMaterialAttributeDto[];
}
