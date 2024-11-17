import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { ApprovalInventoryReportDetailDto } from './dto/approval-inventory-report-detail.dto';
import { CreateInventoryReportDetailDto } from './dto/create-inventory-report-detail.dto';
import { RecordInventoryReportDetail } from './dto/record-inventory-report-detail.dto';
import { UpdateInventoryReportDetailDto } from './dto/update-inventory-report-detail.dto';
import { InventoryReportDetailService } from './inventory-report-detail.service';
import { WarehouseStaffQuantityReportDetails } from './dto/warehouse-staff-quantity-report.dto';

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
  findOne(@Param('id', CustomUUIDPipe) id: string) {
    return this.inventoryReportDetailService.findOne(id);
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

  @Patch(':id/warehouse-staff/process')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_STAFF)
  processInventoryDetail(
    @Param('id', CustomUUIDPipe) id: string,
    @Body() updateInventoryReportDetailDto: WarehouseStaffQuantityReportDetails,
    @GetUser() user: AuthenUser,
  ) {
    return this.inventoryReportDetailService.handleRecordInventoryReportDetail(
      id,
      updateInventoryReportDetailDto,
      user.warehouseStaffId,
    );
  }

  // @Patch(':id/process')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RoleCode.WAREHOUSE_STAFF)
  // processInventoryDetail(
  //   @Param('id', CustomUUIDPipe) id: string,
  //   @Body() updateInventoryReportDetailDto: RecordInventoryReportDetail,
  //   @GetUser() user: AuthenUser,
  // ) {
  //   return this.inventoryReportDetailService.handleRecordInventoryReportDetail(
  //     id,
  //     updateInventoryReportDetailDto,
  //     user.warehouseStaffId,
  //   );
  // }

  // @Patch(':id/approve')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RoleCode.WAREHOUSE_MANAGER)
  // processInventoryDetailApproval(
  //   @Param('id', CustomUUIDPipe) id: string,
  //   @Body() approvalInventoryReportDetailDto: ApprovalInventoryReportDetailDto,
  //   @GetUser() user: AuthenUser,
  // ) {
  //   return this.inventoryReportDetailService.handleInventoryReportDetailApproval(
  //     id,
  //     approvalInventoryReportDetailDto,
  //     user.warehouseManagerId,
  //   );
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryReportDetailService.remove(+id);
  }
}
