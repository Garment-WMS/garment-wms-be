import { Module } from '@nestjs/common';
import { PoDeliveryMaterialController } from './po-delivery-material.controller';
import { PoDeliveryMaterialService } from './po-delivery-material.service';

@Module({
  controllers: [PoDeliveryMaterialController],
  providers: [PoDeliveryMaterialService],
})
export class PoDeliveryMaterialModule {}
