import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReceiptAdjustmentService } from './receipt-adjustment.service';
import { CreateReceiptAdjustmentDto } from './dto/create-receipt-adjustment.dto';
import { UpdateReceiptAdjustmentDto } from './dto/update-receipt-adjustment.dto';

@Controller('receipt-adjustment')
export class ReceiptAdjustmentController {
  constructor(private readonly receiptAdjustmentService: ReceiptAdjustmentService) {}

  @Post()
  create(@Body() createReceiptAdjustmentDto: CreateReceiptAdjustmentDto) {
    return this.receiptAdjustmentService.create(createReceiptAdjustmentDto);
  }

  @Get()
  findAll() {
    return this.receiptAdjustmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receiptAdjustmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceiptAdjustmentDto: UpdateReceiptAdjustmentDto) {
    return this.receiptAdjustmentService.update(+id, updateReceiptAdjustmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receiptAdjustmentService.remove(+id);
  }
}
