import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PoPoDeliveryBridgeService } from './po-po-delivery-bridge.service';
import { CreatePoPoDeliveryBridgeDto } from './dto/create-po-po-delivery-bridge.dto';
import { UpdatePoPoDeliveryBridgeDto } from './dto/update-po-po-delivery-bridge.dto';

@Controller('po-po-delivery-bridge')
export class PoPoDeliveryBridgeController {
  constructor(private readonly poPoDeliveryBridgeService: PoPoDeliveryBridgeService) {}

  @Post()
  create(@Body() createPoPoDeliveryBridgeDto: CreatePoPoDeliveryBridgeDto) {
    return this.poPoDeliveryBridgeService.create(createPoPoDeliveryBridgeDto);
  }

  @Get()
  findAll() {
    return this.poPoDeliveryBridgeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poPoDeliveryBridgeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoPoDeliveryBridgeDto: UpdatePoPoDeliveryBridgeDto) {
    return this.poPoDeliveryBridgeService.update(+id, updatePoPoDeliveryBridgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poPoDeliveryBridgeService.remove(+id);
  }
}
