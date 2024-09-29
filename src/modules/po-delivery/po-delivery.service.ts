import { Injectable } from '@nestjs/common';
import { CreatePoDeliveryDto } from './dto/create-po-delivery.dto';
import { UpdatePoDeliveryDto } from './dto/update-po-delivery.dto';

@Injectable()
export class PoDeliveryService {
  create(createPoDeliveryDto: CreatePoDeliveryDto) {
    return 'This action adds a new poDelivery';
  }

  findAll() {
    return `This action returns all poDelivery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} poDelivery`;
  }

  update(id: number, updatePoDeliveryDto: UpdatePoDeliveryDto) {
    return `This action updates a #${id} poDelivery`;
  }

  remove(id: number) {
    return `This action removes a #${id} poDelivery`;
  }
}
