import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InspectionReportService } from './inspection-report.service';
import { CreateInspectionReportDto } from './dto/create-inspection-report.dto';
import { UpdateInspectionReportDto } from './dto/update-inspection-report.dto';

@Controller('inspection-report')
export class InspectionReportController {
  constructor(private readonly inspectionReportService: InspectionReportService) {}

  @Post()
  create(@Body() createInspectionReportDto: CreateInspectionReportDto) {
    return this.inspectionReportService.create(createInspectionReportDto);
  }

  @Get()
  findAll() {
    return this.inspectionReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inspectionReportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInspectionReportDto: UpdateInspectionReportDto) {
    return this.inspectionReportService.update(+id, updateInspectionReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inspectionReportService.remove(+id);
  }
}
