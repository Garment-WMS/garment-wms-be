import { Module } from '@nestjs/common';
import { PoDeliveryMaterialService } from './po_delivery_material.service';
import { PoDeliveryMaterialController } from './po_delivery_material.controller';

@Module({
  controllers: [PoDeliveryMaterialController],
  providers: [PoDeliveryMaterialService],
})
export class PoDeliveryMaterialModule {}
