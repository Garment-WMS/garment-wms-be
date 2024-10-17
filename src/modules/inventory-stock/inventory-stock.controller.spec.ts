import { Test, TestingModule } from '@nestjs/testing';
import { InventoryStockController } from './inventory-stock.controller';
import { InventoryStockService } from './inventory-stock.service';

describe('InventoryStockController', () => {
  let controller: InventoryStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryStockController],
      providers: [InventoryStockService],
    }).compile();

    controller = module.get<InventoryStockController>(InventoryStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
