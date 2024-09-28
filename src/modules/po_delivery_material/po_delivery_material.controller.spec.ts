import { Test, TestingModule } from '@nestjs/testing';
import { PoDeliveryMaterialController } from './po_delivery_material.controller';
import { PoDeliveryMaterialService } from './po_delivery_material.service';

describe('PoDeliveryMaterialController', () => {
  let controller: PoDeliveryMaterialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoDeliveryMaterialController],
      providers: [PoDeliveryMaterialService],
    }).compile();

    controller = module.get<PoDeliveryMaterialController>(PoDeliveryMaterialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
