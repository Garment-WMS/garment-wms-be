import { Test, TestingModule } from '@nestjs/testing';
import { ProductReceiptController } from './product-receipt.controller';
import { ProductReceiptService } from './product-receipt.service';

describe('ProductReceiptController', () => {
  let controller: ProductReceiptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductReceiptController],
      providers: [ProductReceiptService],
    }).compile();

    controller = module.get<ProductReceiptController>(ProductReceiptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
