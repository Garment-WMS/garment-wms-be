import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Prisma, RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { FilterDto } from 'src/common/dto/filter-query.dto';
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
    return this.inventoryReportPlanService.create(
      createInventoryReportPlanDto,
      user.warehouseManagerId,
    );
  }

  @Get()
  findAll(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.InventoryReportPlanWhereInput>(
        [],
        [{ createdAt: 'desc' }, { id: 'asc' }, { updatedAt: 'asc' }],
      ),
    )
    filterOptions: FilterDto<Prisma.InventoryReportPlanWhereInput>,
  ) {
    return this.inventoryReportPlanService.findAll(filterOptions.findOptions);
  }

  // @Get('warehouse-staff')
  // @UseGuards(JwtAuthGuard,RolesGuard)
  // @Roles(RoleCode.WAREHOUSE_STAFF)
  // getAllInventoryReportPlanByWarehouseStaff(@GetUser() user: AuthenUser) {
  //   return this.inventoryReportPlanService.getAllInventoryReportPlanByWarehouseStaff(user.warehouseStaffId);
  // }

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
