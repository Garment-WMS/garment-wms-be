import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateGeneralSearchDto } from './dto/create-general-search.dto';
import { UpdateGeneralSearchDto } from './dto/update-general-search.dto';
import { GeneralSearchService } from './general-search.service';

@Controller('search')
export class GeneralSearchController {
  constructor(private readonly generalSearchService: GeneralSearchService) {}

  @Post()
  create(@Body() createGeneralSearchDto: CreateGeneralSearchDto) {
    return this.generalSearchService.create(createGeneralSearchDto);
  }

  @Get('/material-product')
  findAll(@Query('code') code: string) {
    return this.generalSearchService.findMaterialOrProductByCode(code);
  }

  @Get('/receipt')
  findReceipt(@Query('code') code: string) {
    return this.generalSearchService.findReceiptByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generalSearchService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGeneralSearchDto: UpdateGeneralSearchDto,
  ) {
    return this.generalSearchService.update(+id, updateGeneralSearchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generalSearchService.remove(+id);
  }
}
