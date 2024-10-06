import { Injectable } from '@nestjs/common';
import { CreatePoPoDeliveryBridgeDto } from './dto/create-po-po-delivery-bridge.dto';
import { UpdatePoPoDeliveryBridgeDto } from './dto/update-po-po-delivery-bridge.dto';

@Injectable()
export class PoPoDeliveryBridgeService {
  create(createPoPoDeliveryBridgeDto: CreatePoPoDeliveryBridgeDto) {
    return 'This action adds a new poPoDeliveryBridge';
  }

  findAll() {
    return `This action returns all poPoDeliveryBridge`;
  }

  findOne(id: number) {
    return `This action returns a #${id} poPoDeliveryBridge`;
  }

  update(id: number, updatePoPoDeliveryBridgeDto: UpdatePoPoDeliveryBridgeDto) {
    return `This action updates a #${id} poPoDeliveryBridge`;
  }

  remove(id: number) {
    return `This action removes a #${id} poPoDeliveryBridge`;
  }
}
