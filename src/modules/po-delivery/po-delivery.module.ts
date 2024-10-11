import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PoDeliveryMaterialModule } from '../po-delivery-material/po-delivery-material.module';
import { PoDeliveryController } from './po-delivery.controller';
import { PoDeliveryService } from './po-delivery.service';

@Module({
  controllers: [PoDeliveryController],
  imports: [PrismaModule, PoDeliveryMaterialModule],
  providers: [PoDeliveryService],
  exports: [PoDeliveryService],
})
export class PoDeliveryModule {}
