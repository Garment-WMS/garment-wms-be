import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductPlanService } from './product-plan.service';
import { CreateProductPlanDto } from './dto/create-product-plan.dto';
import { UpdateProductPlanDto } from './dto/update-product-plan.dto';

@Controller('product-plan')
export class ProductPlanController {
  constructor(private readonly productPlanService: ProductPlanService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createProductPlanDto: CreateProductPlanDto) {
    return this.productPlanService.create(createProductPlanDto);
  }

  @Get()
  findAll() {
    return this.productPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productPlanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductPlanDto: UpdateProductPlanDto) {
    return this.productPlanService.update(+id, updateProductPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productPlanService.remove(+id);
  }
}
