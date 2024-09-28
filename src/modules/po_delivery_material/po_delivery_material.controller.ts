import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PoDeliveryMaterialService } from './po_delivery_material.service';
import { CreatePoDeliveryMaterialDto } from './dto/create-po_delivery_material.dto';
import { UpdatePoDeliveryMaterialDto } from './dto/update-po_delivery_material.dto';

@Controller('po-delivery-material')
export class PoDeliveryMaterialController {
  constructor(private readonly poDeliveryMaterialService: PoDeliveryMaterialService) {}

  @Post()
  create(@Body() createPoDeliveryMaterialDto: CreatePoDeliveryMaterialDto) {
    return this.poDeliveryMaterialService.create(createPoDeliveryMaterialDto);
  }

  @Get()
  findAll() {
    return this.poDeliveryMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poDeliveryMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoDeliveryMaterialDto: UpdatePoDeliveryMaterialDto) {
    return this.poDeliveryMaterialService.update(+id, updatePoDeliveryMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poDeliveryMaterialService.remove(+id);
  }
}
