import { Module } from '@nestjs/common';
import { QuarterlyProductPlanService } from './quarterly-product-plan.service';
import { QuarterlyProductPlanController } from './quarterly-product-plan.controller';

@Module({
  controllers: [QuarterlyProductPlanController],
  providers: [QuarterlyProductPlanService],
})
export class QuarterlyProductPlanModule {}
