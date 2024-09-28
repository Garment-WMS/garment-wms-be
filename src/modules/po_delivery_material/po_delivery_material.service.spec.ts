import { Test, TestingModule } from '@nestjs/testing';
import { PoDeliveryMaterialService } from './po_delivery_material.service';

describe('PoDeliveryMaterialService', () => {
  let service: PoDeliveryMaterialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoDeliveryMaterialService],
    }).compile();

    service = module.get<PoDeliveryMaterialService>(PoDeliveryMaterialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
