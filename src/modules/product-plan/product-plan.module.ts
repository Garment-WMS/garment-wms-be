import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ExcelModule } from '../excel/excel.module';
import { ProductPlanDetailModule } from '../product-plan-detail/product-plan-detail.module';
import { PurchaseOrderModule } from '../purchase-order/purchase-order.module';
import { ProductPlanController } from './product-plan.controller';
import { ProductPlanService } from './product-plan.service';

@Module({
  controllers: [ProductPlanController],
  imports: [
    PrismaModule,
    ProductPlanDetailModule,
    ExcelModule,
  ],
  providers: [ProductPlanService],
  exports: [ProductPlanService],
})
export class ProductPlanModule {}
