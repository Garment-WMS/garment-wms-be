import { Test, TestingModule } from '@nestjs/testing';
import { InventoryUpdateStatusController } from './inventory-update-status.controller';
import { InventoryUpdateStatusService } from './inventory-update-status.service';

describe('InventoryUpdateStatusController', () => {
  let controller: InventoryUpdateStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryUpdateStatusController],
      providers: [InventoryUpdateStatusService],
    }).compile();

    controller = module.get<InventoryUpdateStatusController>(InventoryUpdateStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
