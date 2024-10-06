import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PurchaseOrderModule } from '../purchase-order/purchase-order.module';
import { PoDeliveryController } from './po-delivery.controller';
import { PoDeliveryService } from './po-delivery.service';

@Module({
  controllers: [PoDeliveryController],
  imports: [PrismaModule, PurchaseOrderModule],
  providers: [PoDeliveryService],
  exports: [PoDeliveryService],
})
export class PoDeliveryModule {}
