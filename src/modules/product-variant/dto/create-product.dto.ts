import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { IsProductExist } from 'src/modules/product/validator/is-product-exist.validator';
import { NestedProductAttributeDto } from './nested-product-attribute.dto';
import { NestedProductSizeDto } from './nested-product-size.dto';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsProductExist()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(3)
  code: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => NestedProductSizeDto)
  @ValidateNested({ each: true })
  productSizes?: NestedProductSizeDto[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => NestedProductAttributeDto)
  @ValidateNested({ each: true })
  productAttributes?: NestedProductAttributeDto[];
}
