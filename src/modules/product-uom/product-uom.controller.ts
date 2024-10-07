import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductUomService } from './product-uom.service';
import { CreateProductUomDto } from './dto/create-product-uom.dto';
import { UpdateProductUomDto } from './dto/update-product-uom.dto';

@Controller('product-uom')
export class ProductUomController {
  constructor(private readonly productUomService: ProductUomService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createProductUomDto: CreateProductUomDto) {
    return this.productUomService.create(createProductUomDto);
  }

  @Get()
  findAll() {
    return this.productUomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productUomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductUomDto: UpdateProductUomDto) {
    return this.productUomService.update(+id, updateProductUomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productUomService.remove(+id);
  }
}
