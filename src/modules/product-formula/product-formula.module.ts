import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductFormulaMaterialModule } from '../product-formula-material/product-formula-material.module';
import { ProductFormulaController } from './product-formula.controller';
import { ProductFormulaService } from './product-formula.service';
import { IsProductFormulaExistValidator } from './validator/is-product-formula-exist.validator';
import { ExcelModule } from '../excel/excel.module';

@Module({
  controllers: [ProductFormulaController],
  imports: [PrismaModule, ProductFormulaMaterialModule,ExcelModule],
  providers: [ProductFormulaService, IsProductFormulaExistValidator],
  exports: [ProductFormulaService, IsProductFormulaExistValidator],
})
export class ProductFormulaModule {}
