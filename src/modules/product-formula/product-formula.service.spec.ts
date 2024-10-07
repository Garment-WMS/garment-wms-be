import { Test, TestingModule } from '@nestjs/testing';
import { ProductFormulaService } from './product-formula.service';

describe('ProductFormulaService', () => {
  let service: ProductFormulaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductFormulaService],
    }).compile();

    service = module.get<ProductFormulaService>(ProductFormulaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
