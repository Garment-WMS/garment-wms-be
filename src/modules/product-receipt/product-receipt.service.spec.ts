import { Test, TestingModule } from '@nestjs/testing';
import { ProductReceiptService } from './product-receipt.service';

describe('ProductReceiptService', () => {
  let service: ProductReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductReceiptService],
    }).compile();

    service = module.get<ProductReceiptService>(ProductReceiptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
