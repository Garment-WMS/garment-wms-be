import { PartialType } from '@nestjs/swagger';
import { CreateProductFormulaDto } from './create-product-formula.dto';

export class UpdateProductFormulaDto extends PartialType(CreateProductFormulaDto) {}
