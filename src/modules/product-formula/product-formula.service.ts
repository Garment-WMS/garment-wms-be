import { Injectable } from '@nestjs/common';
import { CreateProductFormulaDto } from './dto/create-product-formula.dto';
import { UpdateProductFormulaDto } from './dto/update-product-formula.dto';

@Injectable()
export class ProductFormulaService {
  create(createProductFormulaDto: CreateProductFormulaDto) {
    return 'This action adds a new productFormula';
  }

  findAll() {
    return `This action returns all productFormula`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productFormula`;
  }

  update(id: number, updateProductFormulaDto: UpdateProductFormulaDto) {
    return `This action updates a #${id} productFormula`;
  }

  remove(id: number) {
    return `This action removes a #${id} productFormula`;
  }
}
