import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma, RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { CancelledPurchaseOrderDto } from './dto/cancelled-purchase-order.dto';
import { UpdatePurchaseOrderStatusDto } from './dto/update-purchase-order-status.dto';
import { PurchaseOrderService } from './purchase-order.service';
import { ChartDto } from './dto/chart.dto';

@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  getPurchaseOrders(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.PurchaseOrderWhereInput>(
        ['productionPlan.code'],
        [
          {
            createdAt: 'desc',
          },
        ],
      ),
    )
    filterDto: FilterDto<Prisma.PurchaseOrderWhereInput>,
  ) {
    return this.purchaseOrderService.getPurchaseOrders(filterDto.findOptions);
  }

  @Get('chart')
  getPurchaseOrderChart(@Body() chartDto: ChartDto) {
    return this.purchaseOrderService.getPurchaseOrderChart(chartDto);
  }

  @Get('all')
  getAllPurchaseOrders() {
    return this.purchaseOrderService.getAllPurchaseOrders();
  }
  @Get('status')
  getPurchaseOrderStatus() {
    return this.purchaseOrderService.getPurchaseOrderStatus();
  }
  @Get('statistic')
  getPurchaseOrderStatistics() {
    return this.purchaseOrderService.getPurchaseOrderStatistics();
  }
  @Get('statistic/history')
  getPurchaseOrderStatisticsHistory(@Query('from') from, @Query('to') to) {
    return this.purchaseOrderService.getPurchaseOrderStatisticsHistory(from,to);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.PURCHASING_STAFF)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file,
    @GetUser() user: AuthenUser,
    @Body('productionPlanId') productionPlanId: string,
  ) {
    const fileResult: any =
      await this.purchaseOrderService.createPurchaseOrderWithExcelFile(
        file,
        user.purchasingStaffId,
      );
    return fileResult;
  }

  @Patch('generate_code')
  async generatePurchaseOrderCode() {
    return this.purchaseOrderService.updateAllPurchaseOrderCodes();
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  async deletePurchaseOrder(@Param('id', CustomUUIDPipe) id: string) {
    return this.purchaseOrderService.deletePurchaseOrder(id);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async getPurchaseOrderById(@Param('id', CustomUUIDPipe) id: string) {
    const purchaseOrder =
      await this.purchaseOrderService.findByIdWithResponse(id);
    if (!purchaseOrder) {
      throw new NotFoundException('Purchase Order not found');
    }
    return purchaseOrder;
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe())
  async updatePurchaseOrder(
    @Param('id', CustomUUIDPipe) id: string,
    @Body() updatePurchaseOrderStatusDto: UpdatePurchaseOrderStatusDto,
  ) {
    return this.purchaseOrderService.updatePurchaseOrderStatus(
      id,
      updatePurchaseOrderStatusDto,
    );
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.PURCHASING_STAFF)
  @UsePipes(new ValidationPipe())
  async cancelPurchaseOrder(
    @Param('id', CustomUUIDPipe) id: string,
    @Body() cancelPurchaseOrder: CancelledPurchaseOrderDto,
    @GetUser() user: AuthenUser,
  ) {
    return this.purchaseOrderService.cancelledPurchaseOrder(
      id,
      cancelPurchaseOrder,
      user.purchasingStaffId,
    );
  }
}
