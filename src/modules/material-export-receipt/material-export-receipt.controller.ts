import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaterialExportReceiptService } from './material-export-receipt.service';
import { CreateMaterialExportReceiptDto } from './dto/create-material-export-receipt.dto';
import { UpdateMaterialExportReceiptDto } from './dto/update-material-export-receipt.dto';

@Controller('material-export-receipt')
export class MaterialExportReceiptController {
  constructor(private readonly materialExportReceiptService: MaterialExportReceiptService) {}

  @Post()
  create(@Body() createMaterialExportReceiptDto: CreateMaterialExportReceiptDto) {
    return this.materialExportReceiptService.create(createMaterialExportReceiptDto);
  }

  @Get()
  findAll() {
    return this.materialExportReceiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialExportReceiptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaterialExportReceiptDto: UpdateMaterialExportReceiptDto) {
    return this.materialExportReceiptService.update(+id, updateMaterialExportReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialExportReceiptService.remove(+id);
  }
}
