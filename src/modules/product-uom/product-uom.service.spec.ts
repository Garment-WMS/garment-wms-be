import { Test, TestingModule } from '@nestjs/testing';
import { ProductUomService } from './product-uom.service';

describe('ProductUomService', () => {
  let service: ProductUomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductUomService],
    }).compile();

    service = module.get<ProductUomService>(ProductUomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
