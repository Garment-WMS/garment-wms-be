import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductFormulaMaterialService } from './product-formula-material.service';
import { CreateProductFormulaMaterialDto } from './dto/create-product-formula-material.dto';
import { UpdateProductFormulaMaterialDto } from './dto/update-product-formula-material.dto';

@Controller('product-formula-material')
export class ProductFormulaMaterialController {
  constructor(private readonly productFormulaMaterialService: ProductFormulaMaterialService) {}

  @Post()
  create(@Body() createProductFormulaMaterialDto: CreateProductFormulaMaterialDto) {
    return this.productFormulaMaterialService.create(createProductFormulaMaterialDto);
  }

  @Get()
  findAll() {
    return this.productFormulaMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productFormulaMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductFormulaMaterialDto: UpdateProductFormulaMaterialDto) {
    return this.productFormulaMaterialService.update(+id, updateProductFormulaMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productFormulaMaterialService.remove(+id);
  }
}
