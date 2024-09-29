import { Module } from '@nestjs/common';
import { PoDeliveryController } from './po-delivery.controller';
import { PoDeliveryService } from './po-delivery.service';

@Module({
  controllers: [PoDeliveryController],
  providers: [PoDeliveryService],
})
export class PoDeliveryModule {}
