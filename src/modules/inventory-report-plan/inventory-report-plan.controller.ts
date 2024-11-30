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
import { ApiTags } from '@nestjs/swagger';
import { Prisma, RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { CreateInventoryReportPlanDto } from './dto/create-inventory-report-plan.dto';
import { CreateOverAllInventoryReportPlanDto } from './dto/over-all-report-plan.dto';
import { UpdateInventoryReportPlanDto } from './dto/update-inventory-report-plan.dto';
import { InventoryReportPlanService } from './inventory-report-plan.service';

@ApiTags('inventory-report-plan')
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

  @Post('/overall')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_MANAGER)
  @UsePipes(new ValidationPipe())
  createOverAll(
    @Body() createInventoryReportPlanDto: CreateOverAllInventoryReportPlanDto,
    @GetUser() user: AuthenUser,
  ) {
    return this.inventoryReportPlanService.createOverAllInventoryPlan(
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

  // @Get(':id')
  // findById(@Param('id', CustomUUIDPipe) id: string) {
  //   return this.inventoryReportPlanService.findById(id);
  // }

  @Get('warehouse-staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_STAFF)
  getAllInventoryReportPlanByWarehouseStaff(
    @GetUser() user: AuthenUser,
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.InventoryReportPlanWhereInput>(
        [],
        [{ createdAt: 'desc' }, { id: 'asc' }, { updatedAt: 'asc' }],
      ),
    )
    filterOptions: FilterDto<Prisma.InventoryReportPlanWhereInput>,
  ) {
    return this.inventoryReportPlanService.getAllInventoryReportPlanByWarehouseStaff(
      user.warehouseStaffId,
      filterOptions.findOptions,
    );
  }

  @Patch('/:id/process')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_STAFF)
  processInventoryReportPlanDetail(
    @Param('id', CustomUUIDPipe) id: string,
    @GetUser() user: AuthenUser,
  ) {
    return this.inventoryReportPlanService.processInventoryReportPlan(
      id,
      user.warehouseStaffId,
    );
  }

  @Patch(':id/start')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_MANAGER)
  startInventoryDetail(
    @Param('id', CustomUUIDPipe) id: string,
    @GetUser() user: AuthenUser,
  ) {
    return this.inventoryReportPlanService.startRecordInventoryReportPlan(
      id,
      user.warehouseManagerId,
    );
  }
  @Patch(':id/await')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_MANAGER)
  awaitInventoryReportPlan(
    @Param('id', CustomUUIDPipe) id: string,
    @GetUser() user: AuthenUser,
  ) {
    return this.inventoryReportPlanService.awaitRecordInventoryReportPlan(
      id,
      user.warehouseManagerId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryReportPlanService.findOne(id);
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
    return this.inventoryReportPlanService.remove(id);
  }
}
