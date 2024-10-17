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
import { CreateInventoryReportDto } from './dto/create-inventory-report.dto';
import { UpdateInventoryReportDto } from './dto/update-inventory-report.dto';
import { InventoryReportService } from './inventory-report.service';

@Controller('inventory-report')
@ApiTags('Inventory Report')
export class InventoryReportController {
  constructor(
    private readonly inventoryReportService: InventoryReportService,
  ) {}

  @Post()
  create(@Body() createInventoryReportDto: CreateInventoryReportDto) {
    return this.inventoryReportService.create(createInventoryReportDto);
  }

  @Get()
  findAll() {
    return this.inventoryReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryReportService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryReportDto: UpdateInventoryReportDto,
  ) {
    return this.inventoryReportService.update(+id, updateInventoryReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryReportService.remove(+id);
  }
}
