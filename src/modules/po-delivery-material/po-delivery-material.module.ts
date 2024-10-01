import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PoDeliveryMaterialController } from './po-delivery-material.controller';
import { PoDeliveryMaterialService } from './po-delivery-material.service';

@Module({
  controllers: [PoDeliveryMaterialController],
  imports: [PrismaModule],
  providers: [PoDeliveryMaterialService],
  exports: [PoDeliveryMaterialService],
})
export class PoDeliveryMaterialModule {}
