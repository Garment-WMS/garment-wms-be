import { Test, TestingModule } from '@nestjs/testing';
import { InventoryStockService } from './inventory-stock.service';

describe('InventoryStockService', () => {
  let service: InventoryStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryStockService],
    }).compile();

    service = module.get<InventoryStockService>(InventoryStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
