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
import { WarehouseManagerQuantityReportDetails } from '../inventory-report-detail/dto/warehouse-manager-quantity-report.dto';
import { WarehouseStaffQuantityReportDetails } from '../inventory-report-detail/dto/warehouse-staff-quantity-report.dto';
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_MANAGER)
  @UsePipes(new ValidationPipe())
  createPost(
    @Body() createInventoryReportDto: CreateInventoryReportDto,
    @GetUser() user: AuthenUser,
  ) {
    return this.inventoryReportService.create(
      createInventoryReportDto,
      user.warehouseManagerId,
    );
  }

  @Post('/material-variant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_MANAGER)
  @UsePipes(new ValidationPipe())
  create(
    @Body() createInventoryReportDto: CreateInventoryReportDto,
    @GetUser() user: AuthenUser,
  ) {
    return this.inventoryReportService.create(
      createInventoryReportDto,
      user.warehouseManagerId,
    );
  }

  @Get()
  findAll(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.InventoryReportWhereInput>(
        ['quarterlyProductionPlan'],
        [
          {
            createdAt: 'desc',
          },
          {
            id: 'asc',
          },
        ],
      ),
    )
    filterDto: FilterDto<Prisma.InventoryReportWhereInput>,
  ) {
    return this.inventoryReportService.findAll(filterDto.findOptions);
  }
  @Get(':id/test')
  test(@Param('id') id: string) {
    return this.inventoryReportService.test(id);
  }

  @Patch(':id/record')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_STAFF)
  processInventoryDetail(
    @Param('id', CustomUUIDPipe) id: string,
    @Body() updateInventoryReportDetailDto: WarehouseStaffQuantityReportDetails,
    @GetUser() user: AuthenUser,
  ) {
    return this.inventoryReportService.handleRecordInventoryReport(
      id,
      updateInventoryReportDetailDto,
      user.warehouseStaffId,
    );
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_MANAGER)
  processInventoryDetailApproval(
    @Param('id', CustomUUIDPipe) id: string,
    @Body()
    updateInventoryReportDetailDto: WarehouseManagerQuantityReportDetails,
    @GetUser() user: AuthenUser,
  ) {
    return this.inventoryReportService.handleApprovalInventoryReport(
      id,
      updateInventoryReportDetailDto,
      user.warehouseManagerId,
    );
  }

  @Get('warehouse-staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_STAFF)
  findAllByWarehouseStaff(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.InventoryReportWhereInput>(
        ['quarterlyProductionPlan'],
        [
          {
            createdAt: 'desc',
          },
          {
            id: 'asc',
          },
        ],
      ),
    )
    filterDto: FilterDto<Prisma.InventoryReportWhereInput>,
    @GetUser() user: AuthenUser,
  ) {
    return this.inventoryReportService.findAllByWarehouseStaff(
      filterDto.findOptions,
      user.warehouseStaffId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryReportService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryReportDto: UpdateInventoryReportDto,
  ) {
    return this.inventoryReportService.update(id, updateInventoryReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryReportService.remove(+id);
  }
}
