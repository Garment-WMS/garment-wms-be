import { Test, TestingModule } from '@nestjs/testing';
import { ProductionBatchMaterialVariantService } from './production-batch-material-variant.service';

describe('ProductionBatchMaterialVariantService', () => {
  let service: ProductionBatchMaterialVariantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionBatchMaterialVariantService],
    }).compile();

    service = module.get<ProductionBatchMaterialVariantService>(ProductionBatchMaterialVariantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
