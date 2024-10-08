import { Test, TestingModule } from '@nestjs/testing';
import { ProductFormulaMaterialController } from './product-formula-material.controller';
import { ProductFormulaMaterialService } from './product-formula-material.service';

describe('ProductFormulaMaterialController', () => {
  let controller: ProductFormulaMaterialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductFormulaMaterialController],
      providers: [ProductFormulaMaterialService],
    }).compile();

    controller = module.get<ProductFormulaMaterialController>(ProductFormulaMaterialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
