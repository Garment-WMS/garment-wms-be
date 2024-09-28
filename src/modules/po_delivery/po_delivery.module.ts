import { Module } from '@nestjs/common';
import { PoDeliveryService } from './po_delivery.service';
import { PoDeliveryController } from './po_delivery.controller';

@Module({
  controllers: [PoDeliveryController],
  providers: [PoDeliveryService],
})
export class PoDeliveryModule {}
