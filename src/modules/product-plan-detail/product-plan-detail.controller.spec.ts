import { Test, TestingModule } from '@nestjs/testing';
import { ProductPlanDetailController } from './product-plan-detail.controller';
import { ProductPlanDetailService } from './product-plan-detail.service';

describe('ProductPlanDetailController', () => {
  let controller: ProductPlanDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductPlanDetailController],
      providers: [ProductPlanDetailService],
    }).compile();

    controller = module.get<ProductPlanDetailController>(ProductPlanDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
