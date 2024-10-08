import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ProductFormulaService } from '../product-formula.service';

@Injectable()
export class IsProductFormulaExistPipe implements PipeTransform {
  constructor(private readonly productFormulaService: ProductFormulaService) {}
  async transform(value: any) {
    const productFormula = await this.productFormulaService.findById(value);
    if (!productFormula) {
      throw new NotFoundException(`Product formula with id ${value} not found`);
    }
    return value;
  }
}
