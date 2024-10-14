import { DirectFilterPipe } from '@chax-at/prisma-filter';
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
import { UpdatePurchaseOrderStatusDto } from './dto/update-purchase-order-status.dto';
import { PurchaseOrderService } from './purchase-order.service';
import { CancelledPurchaseOrderDto } from './dto/cancelled-purchase-order.dto';

@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  getPurchaseOrders(
    @Query(
      new DirectFilterPipe<any, Prisma.PurchaseOrderWhereInput>(
        [
          'id',
          'poNumber',
          'createdAt',
          'orderDate',
          'finishDate',
          'supplierId',
          'currency',
          'status',
          'quarterlyProductionPlan',
        ],
        ['quarterlyProductionPlan'],
        [
          {
            createdAt: 'desc',
          },
          {
            id: 'asc',
          },
          {
            taxAmount: 'asc',
          },
          {
            finishDate: 'asc',
          },
          {
            orderDate: 'asc',
          },
          {
            poNumber: 'asc',
          },
        ],
      ),
    )
    filterDto: FilterDto<Prisma.PurchaseOrderWhereInput>,
  ) {
    return this.purchaseOrderService.getPurchaseOrders(filterDto.findOptions);
  }
  @Get('status')
  getPurchaseOrderStatus() {
    return this.purchaseOrderService.getPurchaseOrderStatus();
  }
  @Get('statistic')
  getPurchaseOrderStatistics() {
    return this.purchaseOrderService.getPurchaseOrderStatistics();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.PURCHASING_STAFF)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @GetUser() user: AuthenUser) {
    const fileResult: any =
      await this.purchaseOrderService.createPurchaseOrderWithExcelFile(
        file,
        user.purchasingStaffId,
      );
    return fileResult;
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
  @UsePipes(new ValidationPipe())
  async cancelPurchaseOrder(
    @Param('id', CustomUUIDPipe) id: string,
    @Body() cancelPurchaseOrder: CancelledPurchaseOrderDto,
  ) {
    return this.purchaseOrderService.cancelledPurchaseOrder(
      id,
      cancelPurchaseOrder,
    );
  }
}
