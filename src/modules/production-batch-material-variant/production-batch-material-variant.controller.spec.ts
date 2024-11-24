import { Test, TestingModule } from '@nestjs/testing';
import { ProductionBatchMaterialVariantController } from './production-batch-material-variant.controller';
import { ProductionBatchMaterialVariantService } from './production-batch-material-variant.service';

describe('ProductionBatchMaterialVariantController', () => {
  let controller: ProductionBatchMaterialVariantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionBatchMaterialVariantController],
      providers: [ProductionBatchMaterialVariantService],
    }).compile();

    controller = module.get<ProductionBatchMaterialVariantController>(ProductionBatchMaterialVariantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
