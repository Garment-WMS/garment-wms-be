import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PoDeliveryMaterialModule } from '../po-delivery-material/po-delivery-material.module';
import { PoDeliveryController } from './po-delivery.controller';
import { PoDeliveryService } from './po-delivery.service';
import { IsPoDeliveryExistValidator } from './validator/is-po-delivery-exist.validator';

@Module({
  controllers: [PoDeliveryController],
  imports: [PrismaModule, PoDeliveryMaterialModule],
  providers: [PoDeliveryService, IsPoDeliveryExistValidator],
  exports: [PoDeliveryService],
})
export class PoDeliveryModule {}
