import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { NestedCreateProductFormulaMaterialDto } from 'src/modules/product-formula-material/dto/nested-product-formula-material.dto';

export class CreateNestedProductFormulaMaterial {
  @ApiProperty({ type: [NestedCreateProductFormulaMaterialDto] })
  @IsNotEmpty()
  @Type(() => NestedCreateProductFormulaMaterialDto)
  productFormulaMaterials: NestedCreateProductFormulaMaterialDto[];
}
