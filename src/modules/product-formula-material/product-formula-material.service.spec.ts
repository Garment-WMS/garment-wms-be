import { Test, TestingModule } from '@nestjs/testing';
import { ProductFormulaMaterialService } from './product-formula-material.service';

describe('ProductFormulaMaterialService', () => {
  let service: ProductFormulaMaterialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductFormulaMaterialService],
    }).compile();

    service = module.get<ProductFormulaMaterialService>(ProductFormulaMaterialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
