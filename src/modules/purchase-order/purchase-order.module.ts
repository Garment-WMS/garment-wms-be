import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ExcelModule } from '../excel/excel.module';
import { PoDeliveryModule } from '../po-delivery/po-delivery.module';
import { ProductPlanModule } from '../product-plan/product-plan.module';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';

@Module({
  controllers: [PurchaseOrderController],
  imports: [PrismaModule, ExcelModule, PoDeliveryModule, ProductPlanModule],
  providers: [PurchaseOrderService],
  exports: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
