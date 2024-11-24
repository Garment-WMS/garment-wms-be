import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateInventoryStockDto } from './dto/create-inventory-stock.dto';
import { UpdateInventoryStockDto } from './dto/update-inventory-stock.dto';
import { InventoryStockService } from './inventory-stock.service';

@Controller('inventory-stock')
@ApiTags('Inventory Stock')
export class InventoryStockController {
  constructor(private readonly inventoryStockService: InventoryStockService) {}

  @Post()
  create(@Body() createInventoryStockDto: CreateInventoryStockDto) {
    return this.inventoryStockService.create(createInventoryStockDto);
  }
  @Get('/dashboard')
  getInvetoryStockDashboard() {
    return this.inventoryStockService.getInvetoryStockDashboard();

  }

  @Get('/material')
  findAll() {
    return this.inventoryStockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryStockService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryStockDto: UpdateInventoryStockDto,
  ) {
    return this.inventoryStockService.update(+id, updateInventoryStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryStockService.remove(+id);
  }
}
