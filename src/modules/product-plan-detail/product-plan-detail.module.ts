import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductPlanDetailController } from './product-plan-detail.controller';
import { ProductPlanDetailService } from './product-plan-detail.service';
import { IsProductionPlanDetailExistValidator } from './validator/is-production-plan-detail-exist.validator';

@Module({
  controllers: [ProductPlanDetailController],
  imports: [PrismaModule],
  providers: [ProductPlanDetailService, IsProductionPlanDetailExistValidator],
  exports: [ProductPlanDetailService, IsProductionPlanDetailExistValidator],
})
export class ProductPlanDetailModule {}
