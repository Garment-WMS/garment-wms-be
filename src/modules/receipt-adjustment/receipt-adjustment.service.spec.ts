import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptAdjustmentService } from './receipt-adjustment.service';

describe('ReceiptAdjustmentService', () => {
  let service: ReceiptAdjustmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiptAdjustmentService],
    }).compile();

    service = module.get<ReceiptAdjustmentService>(ReceiptAdjustmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
