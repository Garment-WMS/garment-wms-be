import { Controller } from '@nestjs/common';
import { PoDeliveryService } from './po-delivery.service';

@Controller('po-delivery')
export class PoDeliveryController {
  constructor(private readonly poDeliveryService: PoDeliveryService) {}
}
