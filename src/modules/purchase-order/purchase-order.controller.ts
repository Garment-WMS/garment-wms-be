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
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { UpdatePurchaseOrderStatusDto } from './dto/update-purchase-order-status.dto';
import { PurchaseOrderService } from './purchase-order.service';

@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  getPurchaseOrders(
    @Query(
      new DirectFilterPipe<any, Prisma.PurchaseOrderWhereInput>(
        ['id', 'poNumber', 'createdAt', 'supplierId', 'currency', 'status'],
        [],
      ),
    )
    filterDto: FilterDto<Prisma.PurchaseOrderWhereInput>,
  ) {
    return this.purchaseOrderService.getPurchaseOrders(filterDto.findOptions);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    const fileResult: any =
      await this.purchaseOrderService.createPurchaseOrderWithExcelFile(file);
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
    const purchaseOrder = await this.purchaseOrderService.findByIdWithResponse(id);
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
}
