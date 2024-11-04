import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryReportPlanDetailService } from './inventory-report-plan-detail.service';
import { CreateInventoryReportPlanDetailDto } from './dto/create-inventory-report-plan-detail.dto';
import { UpdateInventoryReportPlanDetailDto } from './dto/update-inventory-report-plan-detail.dto';

@Controller('inventory-report-plan-detail')
export class InventoryReportPlanDetailController {
  constructor(private readonly inventoryReportPlanDetailService: InventoryReportPlanDetailService) {}

  @Post()
  create(@Body() createInventoryReportPlanDetailDto: CreateInventoryReportPlanDetailDto) {
    return this.inventoryReportPlanDetailService.create(createInventoryReportPlanDetailDto);
  }

  @Get()
  findAll() {
    return this.inventoryReportPlanDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryReportPlanDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventoryReportPlanDetailDto: UpdateInventoryReportPlanDetailDto) {
    return this.inventoryReportPlanDetailService.update(+id, updateInventoryReportPlanDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryReportPlanDetailService.remove(+id);
  }
}
