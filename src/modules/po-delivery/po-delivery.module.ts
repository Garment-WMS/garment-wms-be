import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PoDeliveryController } from './po-delivery.controller';
import { PoDeliveryService } from './po-delivery.service';

@Module({
  controllers: [PoDeliveryController],
  imports: [PrismaModule],
  providers: [PoDeliveryService],
  exports: [PoDeliveryService],
})
export class PoDeliveryModule {}
