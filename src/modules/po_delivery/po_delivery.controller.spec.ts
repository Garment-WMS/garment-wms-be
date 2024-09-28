import { Test, TestingModule } from '@nestjs/testing';
import { PoDeliveryController } from './po_delivery.controller';
import { PoDeliveryService } from './po_delivery.service';

describe('PoDeliveryController', () => {
  let controller: PoDeliveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoDeliveryController],
      providers: [PoDeliveryService],
    }).compile();

    controller = module.get<PoDeliveryController>(PoDeliveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
