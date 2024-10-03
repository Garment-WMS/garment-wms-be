import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaterialVariantService } from './material-variant.service';
import { CreateMaterialVariantDto } from './dto/create-material-variant.dto';
import { UpdateMaterialVariantDto } from './dto/update-material-variant.dto';

@Controller('material-variant')
export class MaterialVariantController {
  constructor(private readonly materialVariantService: MaterialVariantService) {}

  @Post()
  create(@Body() createMaterialVariantDto: CreateMaterialVariantDto) {
    return this.materialVariantService.create(createMaterialVariantDto);
  }

  @Get()
  findAll() {
    return this.materialVariantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialVariantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaterialVariantDto: UpdateMaterialVariantDto) {
    return this.materialVariantService.update(+id, updateMaterialVariantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialVariantService.remove(+id);
  }
}
