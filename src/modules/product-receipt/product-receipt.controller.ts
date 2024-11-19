import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductReceiptService } from './product-receipt.service';
import { CreateProductReceiptDto } from './dto/create-product-receipt.dto';
import { UpdateProductReceiptDto } from './dto/update-product-receipt.dto';

@Controller('product-receipt')
export class ProductReceiptController {
  constructor(private readonly productReceiptService: ProductReceiptService) {}

  @Post()
  create(@Body() createProductReceiptDto: CreateProductReceiptDto) {
    return this.productReceiptService.create(createProductReceiptDto);
  }

  @Get()
  findAll() {
    return this.productReceiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productReceiptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductReceiptDto: UpdateProductReceiptDto) {
    return this.productReceiptService.update(+id, updateProductReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productReceiptService.remove(+id);
  }
}
