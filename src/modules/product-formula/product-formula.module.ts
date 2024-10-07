import { Module } from '@nestjs/common';
import { ProductFormulaService } from './product-formula.service';
import { ProductFormulaController } from './product-formula.controller';

@Module({
  controllers: [ProductFormulaController],
  providers: [ProductFormulaService],
})
export class ProductFormulaModule {}
