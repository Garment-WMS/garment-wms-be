import { DirectFilterPipe } from '@chax-at/prisma-filter';
import {
  Controller,
  Get,
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
import { PurchaseOrderService } from './purchase-order.service';

@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  getPurchaseOrders(
    @Query(
      new DirectFilterPipe<any, Prisma.PurchaseOrderWhereInput>(
        ['id', 'poNumber', 'createdAt', 'supplierId'],
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
}
