import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuarterlyProductPlanService } from './quarterly-product-plan.service';
import { CreateQuarterlyProductPlanDto } from './dto/create-quarterly-product-plan.dto';
import { UpdateQuarterlyProductPlanDto } from './dto/update-quarterly-product-plan.dto';

@Controller('quarterly-product-plan')
export class QuarterlyProductPlanController {
  constructor(private readonly quarterlyProductPlanService: QuarterlyProductPlanService) {}

  @Post()
  create(@Body() createQuarterlyProductPlanDto: CreateQuarterlyProductPlanDto) {
    return this.quarterlyProductPlanService.create(createQuarterlyProductPlanDto);
  }

  @Get()
  findAll() {
    return this.quarterlyProductPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quarterlyProductPlanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuarterlyProductPlanDto: UpdateQuarterlyProductPlanDto) {
    return this.quarterlyProductPlanService.update(+id, updateQuarterlyProductPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quarterlyProductPlanService.remove(+id);
  }
}
