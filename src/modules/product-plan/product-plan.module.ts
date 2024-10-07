import { Module } from '@nestjs/common';
import { ProductPlanService } from './product-plan.service';
import { ProductPlanController } from './product-plan.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [ProductPlanController],
  imports: [PrismaModule],
  providers: [ProductPlanService],
})
export class ProductPlanModule {}
