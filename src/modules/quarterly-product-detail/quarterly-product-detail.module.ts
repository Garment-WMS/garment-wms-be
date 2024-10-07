import { Module } from '@nestjs/common';
import { QuarterlyProductDetailService } from './quarterly-product-detail.service';
import { QuarterlyProductDetailController } from './quarterly-product-detail.controller';

@Module({
  controllers: [QuarterlyProductDetailController],
  providers: [QuarterlyProductDetailService],
})
export class QuarterlyProductDetailModule {}
