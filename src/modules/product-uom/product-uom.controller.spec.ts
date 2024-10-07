import { Test, TestingModule } from '@nestjs/testing';
import { ProductUomController } from './product-uom.controller';
import { ProductUomService } from './product-uom.service';

describe('ProductUomController', () => {
  let controller: ProductUomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductUomController],
      providers: [ProductUomService],
    }).compile();

    controller = module.get<ProductUomController>(ProductUomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
