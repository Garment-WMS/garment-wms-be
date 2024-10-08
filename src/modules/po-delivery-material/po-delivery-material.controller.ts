import { Controller } from '@nestjs/common';
import { PoDeliveryMaterialService } from './po-delivery-material.service';

@Controller('po-delivery-material')
export class PoDeliveryMaterialController {
  constructor(
    private readonly poDeliveryMaterialService: PoDeliveryMaterialService,
  ) {}
}
