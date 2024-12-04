import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BodyInterceptor } from 'src/common/pipe/parse-form-data-json-pipe.pipe';

@Controller('product-attribute')
export class ProductAttributeController {
  constructor(private readonly productAttributeService: ProductAttributeService) {}

  @Post()
  create(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributeService.create(createProductAttributeDto);
  }


  @Get()
  findAll() {
    return this.productAttributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productAttributeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductAttributeDto: UpdateProductAttributeDto) {
    return this.productAttributeService.update(+id, updateProductAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productAttributeService.remove(+id);
  }
}