import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductPlanDetailService } from './product-plan-detail.service';
import { CreateProductPlanDetailDto } from './dto/create-product-plan-detail.dto';
import { UpdateProductPlanDetailDto } from './dto/update-product-plan-detail.dto';

@Controller('product-plan-detail')
export class ProductPlanDetailController {
  constructor(private readonly productPlanDetailService: ProductPlanDetailService) {}

  @Post()
  create(@Body() createProductPlanDetailDto: CreateProductPlanDetailDto) {
    return this.productPlanDetailService.create(createProductPlanDetailDto);
  }

  @Get()
  findAll() {
    return this.productPlanDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productPlanDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductPlanDetailDto: UpdateProductPlanDetailDto) {
    return this.productPlanDetailService.update(+id, updateProductPlanDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productPlanDetailService.remove(+id);
  }
}
