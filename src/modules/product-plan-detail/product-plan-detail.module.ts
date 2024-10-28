import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductPlanDetailController } from './product-plan-detail.controller';
import { ProductPlanDetailService } from './product-plan-detail.service';

@Module({
  controllers: [ProductPlanDetailController],
  imports: [PrismaModule],
  providers: [ProductPlanDetailService],
  exports: [ProductPlanDetailService],
})
export class ProductPlanDetailModule {}
