import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ProductModule } from '../product-variant/product-variant.module';
import { InventoryStockController } from './inventory-stock.controller';
import { InventoryStockService } from './inventory-stock.service';

@Module({
  controllers: [InventoryStockController],
  imports: [PrismaModule, MaterialVariantModule, ProductModule],
  providers: [InventoryStockService],
  exports: [InventoryStockService],
})
export class InventoryStockModule {}
