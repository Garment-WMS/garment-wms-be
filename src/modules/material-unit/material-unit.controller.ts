import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaterialUnitService } from './material-unit.service';
import { CreateMaterialUnitDto } from './dto/create-material-unit.dto';
import { UpdateMaterialUnitDto } from './dto/update-material-unit.dto';

@Controller('material-unit')
export class MaterialUnitController {
  constructor(private readonly materialUnitService: MaterialUnitService) {}

  @Post()
  create(@Body() createMaterialUnitDto: CreateMaterialUnitDto) {
    return this.materialUnitService.create(createMaterialUnitDto);
  }

  @Get()
  findAll() {
    return this.materialUnitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialUnitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaterialUnitDto: UpdateMaterialUnitDto) {
    return this.materialUnitService.update(+id, updateMaterialUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialUnitService.remove(+id);
  }
}
