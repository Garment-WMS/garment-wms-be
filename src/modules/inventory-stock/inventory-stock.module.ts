import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { InventoryStockController } from './inventory-stock.controller';
import { InventoryStockService } from './inventory-stock.service';
import { MaterialReceiptModule } from '../material-receipt/material-receipt.module';

@Module({
  controllers: [InventoryStockController],
  imports: [PrismaModule, MaterialVariantModule, ProductVariantModule],
  providers: [InventoryStockService],
  exports: [InventoryStockService],
})
export class InventoryStockModule {}
