import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ExcelModule } from '../excel/excel.module';
import { PoDeliveryMaterialModule } from '../po-delivery-material/po-delivery-material.module';
import { PoDeliveryModule } from '../po-delivery/po-delivery.module';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';

@Module({
  controllers: [PurchaseOrderController],
  imports: [
    PrismaModule,
    ExcelModule,
    PoDeliveryModule,
    PoDeliveryMaterialModule,
  ],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
