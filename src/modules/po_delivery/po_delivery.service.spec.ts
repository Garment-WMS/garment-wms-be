import { Test, TestingModule } from '@nestjs/testing';
import { PoDeliveryService } from './po_delivery.service';

describe('PoDeliveryService', () => {
  let service: PoDeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoDeliveryService],
    }).compile();

    service = module.get<PoDeliveryService>(PoDeliveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
