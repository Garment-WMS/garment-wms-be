import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuarterlyProductDetailService } from './quarterly-product-detail.service';
import { CreateQuarterlyProductDetailDto } from './dto/create-quarterly-product-detail.dto';
import { UpdateQuarterlyProductDetailDto } from './dto/update-quarterly-product-detail.dto';

@Controller('quarterly-product-detail')
export class QuarterlyProductDetailController {
  constructor(private readonly quarterlyProductDetailService: QuarterlyProductDetailService) {}

  @Post()
  create(@Body() createQuarterlyProductDetailDto: CreateQuarterlyProductDetailDto) {
    return this.quarterlyProductDetailService.create(createQuarterlyProductDetailDto);
  }

  @Get()
  findAll() {
    return this.quarterlyProductDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quarterlyProductDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuarterlyProductDetailDto: UpdateQuarterlyProductDetailDto) {
    return this.quarterlyProductDetailService.update(+id, updateQuarterlyProductDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quarterlyProductDetailService.remove(+id);
  }
}
