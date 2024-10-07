import { PartialType } from '@nestjs/swagger';
import { CreateProductFormulaMaterialDto } from './create-product-formula-material.dto';

export class UpdateProductFormulaMaterialDto extends PartialType(CreateProductFormulaMaterialDto) {}
