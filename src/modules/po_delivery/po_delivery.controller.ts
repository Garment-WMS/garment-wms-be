import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PoDeliveryService } from './po_delivery.service';
import { CreatePoDeliveryDto } from './dto/create-po_delivery.dto';
import { UpdatePoDeliveryDto } from './dto/update-po_delivery.dto';

@Controller('po-delivery')
export class PoDeliveryController {
  constructor(private readonly poDeliveryService: PoDeliveryService) {}

  @Post()
  create(@Body() createPoDeliveryDto: CreatePoDeliveryDto) {
    return this.poDeliveryService.create(createPoDeliveryDto);
  }

  @Get()
  findAll() {
    return this.poDeliveryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poDeliveryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoDeliveryDto: UpdatePoDeliveryDto) {
    return this.poDeliveryService.update(+id, updatePoDeliveryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poDeliveryService.remove(+id);
  }
}
