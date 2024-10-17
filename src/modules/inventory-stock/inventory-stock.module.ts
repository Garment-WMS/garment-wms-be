import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { MaterialModule } from '../material/material.module';
import { ProductModule } from '../product/product.module';
import { InventoryStockController } from './inventory-stock.controller';
import { InventoryStockService } from './inventory-stock.service';

@Module({
  controllers: [InventoryStockController],
  imports: [PrismaModule, MaterialModule, ProductModule],
  providers: [InventoryStockService],
  exports: [InventoryStockService],
})
export class InventoryStockModule {}
