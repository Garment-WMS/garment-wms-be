import { Test, TestingModule } from '@nestjs/testing';
import { ProductionBatchController } from './production-batch.controller';
import { ProductionBatchService } from './production-batch.service';

describe('ProductionBatchController', () => {
  let controller: ProductionBatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionBatchController],
      providers: [ProductionBatchService],
    }).compile();

    controller = module.get<ProductionBatchController>(ProductionBatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
