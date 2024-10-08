import { DirectFilterPipe } from '@chax-at/prisma-filter';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
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

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async getPurchaseOrderById(@Param('id', CustomUUIDPipe) id: string) {
    const purchaseOrder = await this.purchaseOrderService.findById(id);
    if (!purchaseOrder) {
      throw new NotFoundException('Purchase Order not found');
    }
    return purchaseOrder;
  }
}
