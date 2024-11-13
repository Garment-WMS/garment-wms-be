import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateMaterialAttributeDto } from './create-material-attribute.dto';

export class ArrayMaterialAttribute {
  @ApiProperty()
  @IsArray()
  @Type(() => CreateMaterialAttributeDto)
  @ValidateNested({ each: true })
  materialAttributes: CreateMaterialAttributeDto[];
}
