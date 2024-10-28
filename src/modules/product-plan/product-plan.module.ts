import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductPlanDetailModule } from '../product-plan-detail/product-plan-detail.module';
import { ProductPlanController } from './product-plan.controller';
import { ProductPlanService } from './product-plan.service';
import { ExcelModule } from '../excel/excel.module';

@Module({
  controllers: [ProductPlanController],
  imports: [PrismaModule, ProductPlanDetailModule,ExcelModule],
  providers: [ProductPlanService],
})
export class ProductPlanModule {}
