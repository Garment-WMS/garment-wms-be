import { Test, TestingModule } from '@nestjs/testing';
import { ProductFormulaController } from './product-formula.controller';
import { ProductFormulaService } from './product-formula.service';

describe('ProductFormulaController', () => {
  let controller: ProductFormulaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductFormulaController],
      providers: [ProductFormulaService],
    }).compile();

    controller = module.get<ProductFormulaController>(ProductFormulaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
