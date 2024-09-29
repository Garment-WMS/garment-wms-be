import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImportRequestDetailService } from './import-request-detail.service';
import { CreateImportRequestDetailDto } from './dto/create-import-request-detail.dto';
import { UpdateImportRequestDetailDto } from './dto/update-import-request-detail.dto';

@Controller('import-request-detail')
export class ImportRequestDetailController {
  constructor(private readonly importRequestDetailService: ImportRequestDetailService) {}

  @Post()
  create(@Body() createImportRequestDetailDto: CreateImportRequestDetailDto) {
    return this.importRequestDetailService.create(createImportRequestDetailDto);
  }

  @Get()
  findAll() {
    return this.importRequestDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importRequestDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImportRequestDetailDto: UpdateImportRequestDetailDto) {
    return this.importRequestDetailService.update(+id, updateImportRequestDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importRequestDetailService.remove(+id);
  }
}
