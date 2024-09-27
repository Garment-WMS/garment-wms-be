import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchaseOrderService } from './purchase_order.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase_order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase_order.dto';

@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post()
  create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchaseOrderService.create(createPurchaseOrderDto);
  }

  @Get()
  findAll() {
    return this.purchaseOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return this.purchaseOrderService.update(+id, updatePurchaseOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrderService.remove(+id);
  }
}
