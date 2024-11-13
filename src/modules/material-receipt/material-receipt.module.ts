import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InventoryStockModule } from '../inventory-stock/inventory-stock.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { PoDeliveryModule } from '../po-delivery/po-delivery.module';
import { MaterialReceiptController } from './material-receipt.controller';
import { MaterialReceiptService } from './material-receipt.service';
import { MaterialPackageModule } from '../material-package/material-package.module';

@Module({
  controllers: [MaterialReceiptController],
  imports: [
    PrismaModule,
    MaterialVariantModule,
    MaterialPackageModule,
    InventoryStockModule,
    PoDeliveryModule,
  ],
  providers: [MaterialReceiptService],
  exports: [MaterialReceiptService],
})
export class MaterialReceiptModule {}
