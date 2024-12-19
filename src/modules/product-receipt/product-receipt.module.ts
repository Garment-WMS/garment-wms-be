import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { InventoryStockModule } from '../inventory-stock/inventory-stock.module';
import { ProductReceiptController } from './product-receipt.controller';
import { ProductReceiptService } from './product-receipt.service';

@Module({
  controllers: [ProductReceiptController],
  providers: [ProductReceiptService],
  imports: [PrismaModule, InventoryStockModule],
  exports: [ProductReceiptService],
})
export class ProductReceiptModule {}
