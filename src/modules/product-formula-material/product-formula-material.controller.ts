import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductFormulaMaterialService } from './product-formula-material.service';
import { CreateProductFormulaMaterialDto } from './dto/create-product-formula-material.dto';
import { UpdateProductFormulaMaterialDto } from './dto/update-product-formula-material.dto';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';

@Controller('product-formula-material')
export class ProductFormulaMaterialController {
  constructor(private readonly productFormulaMaterialService: ProductFormulaMaterialService) {}

  @Patch(':id') 
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id',CustomUUIDPipe) id: string, @Body() updateProductFormulaMaterialDto: UpdateProductFormulaMaterialDto) {
    return this.productFormulaMaterialService.update(id, updateProductFormulaMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id',CustomUUIDPipe) id: string) {
    return this.productFormulaMaterialService.remove(id);
  }
}
