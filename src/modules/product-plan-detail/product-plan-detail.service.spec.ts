import { Test, TestingModule } from '@nestjs/testing';
import { ProductPlanDetailService } from './product-plan-detail.service';

describe('ProductPlanDetailService', () => {
  let service: ProductPlanDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPlanDetailService],
    }).compile();

    service = module.get<ProductPlanDetailService>(ProductPlanDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
