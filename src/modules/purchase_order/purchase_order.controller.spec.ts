import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderController } from './purchase_order.controller';
import { PurchaseOrderService } from './purchase_order.service';

describe('PurchaseOrderController', () => {
  let controller: PurchaseOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseOrderController],
      providers: [PurchaseOrderService],
    }).compile();

    controller = module.get<PurchaseOrderController>(PurchaseOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
