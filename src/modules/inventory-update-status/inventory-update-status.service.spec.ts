import { Test, TestingModule } from '@nestjs/testing';
import { InventoryUpdateStatusService } from './inventory-update-status.service';

describe('InventoryUpdateStatusService', () => {
  let service: InventoryUpdateStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryUpdateStatusService],
    }).compile();

    service = module.get<InventoryUpdateStatusService>(InventoryUpdateStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
