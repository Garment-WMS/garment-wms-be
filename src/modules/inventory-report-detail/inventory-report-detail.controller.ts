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
import { CreateInventoryReportDetailDto } from './dto/create-inventory-report-detail.dto';
import { UpdateInventoryReportDetailDto } from './dto/update-inventory-report-detail.dto';
import { InventoryReportDetailService } from './inventory-report-detail.service';

@ApiTags('inventory-report-detail')
@Controller('inventory-report-detail')
export class InventoryReportDetailController {
  constructor(
    private readonly inventoryReportDetailService: InventoryReportDetailService,
  ) {}

  @Post()
  create(
    @Body() createInventoryReportDetailDto: CreateInventoryReportDetailDto,
  ) {}

  @Get()
  findAll() {
    return this.inventoryReportDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryReportDetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryReportDetailDto: UpdateInventoryReportDetailDto,
  ) {
    return this.inventoryReportDetailService.update(
      +id,
      updateInventoryReportDetailDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryReportDetailService.remove(+id);
  }
}
