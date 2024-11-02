import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaterialExportRequestService } from './material-export-request.service';
import { CreateMaterialExportRequestDto } from './dto/create-material-export-request.dto';
import { UpdateMaterialExportRequestDto } from './dto/update-material-export-request.dto';

@Controller('material-export-request')
export class MaterialExportRequestController {
  constructor(private readonly materialExportRequestService: MaterialExportRequestService) {}

  @Post()
  create(@Body() createMaterialExportRequestDto: CreateMaterialExportRequestDto) {
    return this.materialExportRequestService.create(createMaterialExportRequestDto);
  }

  @Get()
  findAll() {
    return this.materialExportRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialExportRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaterialExportRequestDto: UpdateMaterialExportRequestDto) {
    return this.materialExportRequestService.update(+id, updateMaterialExportRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialExportRequestService.remove(+id);
  }
}
