import { Module } from '@nestjs/common';
import { PoDeliveryMaterialModule } from '../po-delivery-material/po-delivery-material.module';
import { PoDeliveryModule } from '../po-delivery/po-delivery.module';
import { PoPoDeliveryBridgeController } from './po-po-delivery-bridge.controller';
import { PoPoDeliveryBridgeService } from './po-po-delivery-bridge.service';

@Module({
  controllers: [PoPoDeliveryBridgeController],
  imports: [PoDeliveryMaterialModule, PoDeliveryModule],
  providers: [PoPoDeliveryBridgeService],
})
export class PoPoDeliveryBridgeModule {}
