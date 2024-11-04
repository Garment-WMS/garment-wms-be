import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { CreateInventoryReportPlanDto } from './dto/create-inventory-report-plan.dto';
import { UpdateInventoryReportPlanDto } from './dto/update-inventory-report-plan.dto';
import { InventoryReportPlanService } from './inventory-report-plan.service';

@Controller('inventory-report-plan')
export class InventoryReportPlanController {
  constructor(
    private readonly inventoryReportPlanService: InventoryReportPlanService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_MANAGER)
  @UsePipes(new ValidationPipe())
  create(
    @Body() createInventoryReportPlanDto: CreateInventoryReportPlanDto,
    @GetUser() user: AuthenUser,
  ) {
    return this.inventoryReportPlanService.create(createInventoryReportPlanDto,user.warehouseManagerId);
  }

  @Get()
  findAll() {
    return this.inventoryReportPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryReportPlanService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryReportPlanDto: UpdateInventoryReportPlanDto,
  ) {
    return this.inventoryReportPlanService.update(
      +id,
      updateInventoryReportPlanDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryReportPlanService.remove(+id);
  }
}
