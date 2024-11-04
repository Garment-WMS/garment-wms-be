import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InventoryReportPlanDetailService } from './inventory-report-plan-detail.service';
import { CreateInventoryReportPlanDetailDto } from './dto/create-inventory-report-plan-detail.dto';
import { UpdateInventoryReportPlanDetailDto } from './dto/update-inventory-report-plan-detail.dto';
import { RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';

@Controller('inventory-report-plan-detail')
export class InventoryReportPlanDetailController {
  constructor(private readonly inventoryReportPlanDetailService: InventoryReportPlanDetailService) {}

@Get('warehouse-staff')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(RoleCode.WAREHOUSE_STAFF)
  getAllInventoryReportPlanByWarehouseStaff(@GetUser() user: AuthenUser) {
    return this.inventoryReportPlanDetailService.getAllInventoryReportPlanByWarehouseStaff(user.warehouseStaffId);
  }

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
