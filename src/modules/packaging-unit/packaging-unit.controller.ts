import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PackagingUnitService } from './packaging-unit.service';
import { CreatePackagingUnitDto } from './dto/create-packaging-unit.dto';
import { UpdatePackagingUnitDto } from './dto/update-packaging-unit.dto';

@Controller('packaging-unit')
export class PackagingUnitController {
  constructor(private readonly packagingUnitService: PackagingUnitService) {}

  @Post()
  create(@Body() createPackagingUnitDto: CreatePackagingUnitDto) {
    return this.packagingUnitService.create(createPackagingUnitDto);
  }

  @Get()
  findAll() {
    return this.packagingUnitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagingUnitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackagingUnitDto: UpdatePackagingUnitDto) {
    return this.packagingUnitService.update(+id, updatePackagingUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packagingUnitService.remove(+id);
  }
}
