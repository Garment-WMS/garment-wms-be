import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductFormulaService } from './product-formula.service';
import { CreateProductFormulaDto } from './dto/create-product-formula.dto';
import { UpdateProductFormulaDto } from './dto/update-product-formula.dto';

@Controller('product-formula')
export class ProductFormulaController {
  constructor(private readonly productFormulaService: ProductFormulaService) {}

  @Post()
  create(@Body() createProductFormulaDto: CreateProductFormulaDto) {
    return this.productFormulaService.create(createProductFormulaDto);
  }

  @Get()
  findAll() {
    return this.productFormulaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productFormulaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductFormulaDto: UpdateProductFormulaDto) {
    return this.productFormulaService.update(+id, updateProductFormulaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productFormulaService.remove(+id);
  }
}
