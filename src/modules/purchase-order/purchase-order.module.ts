import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ExcelModule } from '../excel/excel.module';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';

@Module({
  controllers: [PurchaseOrderController],
  imports: [PrismaModule, ExcelModule],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
