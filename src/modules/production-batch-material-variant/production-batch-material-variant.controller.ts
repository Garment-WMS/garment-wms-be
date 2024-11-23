import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductionBatchMaterialVariantService } from './production-batch-material-variant.service';
import { CreateProductionBatchMaterialVariantDto } from './dto/create-production-batch-material-variant.dto';
import { UpdateProductionBatchMaterialVariantDto } from './dto/update-production-batch-material-variant.dto';

@Controller('production-batch-material-variant')
export class ProductionBatchMaterialVariantController {
  constructor(private readonly productionBatchMaterialVariantService: ProductionBatchMaterialVariantService) {}

  @Post()
  create(@Body() createProductionBatchMaterialVariantDto: CreateProductionBatchMaterialVariantDto) {
    return this.productionBatchMaterialVariantService.create(createProductionBatchMaterialVariantDto);
  }

  @Get()
  findAll() {
    return this.productionBatchMaterialVariantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productionBatchMaterialVariantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductionBatchMaterialVariantDto: UpdateProductionBatchMaterialVariantDto) {
    return this.productionBatchMaterialVariantService.update(+id, updateProductionBatchMaterialVariantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productionBatchMaterialVariantService.remove(+id);
  }
}
