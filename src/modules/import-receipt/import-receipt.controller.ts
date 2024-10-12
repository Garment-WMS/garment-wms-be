import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImportReceiptService } from './import-receipt.service';
import { CreateImportReceiptDto } from './dto/create-import-receipt.dto';
import { UpdateImportReceiptDto } from './dto/update-import-receipt.dto';

@Controller('import-receipt')
export class ImportReceiptController {
  constructor(private readonly importReceiptService: ImportReceiptService) {}

  @Post()
  create(@Body() createImportReceiptDto: CreateImportReceiptDto) {
    return this.importReceiptService.create(createImportReceiptDto);
  }

  @Get()
  findAll() {
    return this.importReceiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importReceiptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImportReceiptDto: UpdateImportReceiptDto) {
    return this.importReceiptService.update(+id, updateImportReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importReceiptService.remove(+id);
  }
}
