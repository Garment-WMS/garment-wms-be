import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptAdjustmentController } from './receipt-adjustment.controller';
import { ReceiptAdjustmentService } from './receipt-adjustment.service';

describe('ReceiptAdjustmentController', () => {
  let controller: ReceiptAdjustmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptAdjustmentController],
      providers: [ReceiptAdjustmentService],
    }).compile();

    controller = module.get<ReceiptAdjustmentController>(ReceiptAdjustmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
