import { Injectable } from '@nestjs/common';
import { CreatePoDeliveryMaterialDto } from './dto/create-po-delivery-material.dto';
import { UpdatePoDeliveryMaterialDto } from './dto/update-po-delivery-material.dto';

@Injectable()
export class PoDeliveryMaterialService {
  create(createPoDeliveryMaterialDto: CreatePoDeliveryMaterialDto) {
    return 'This action adds a new poDeliveryMaterial';
  }

  findAll() {
    return `This action returns all poDeliveryMaterial`;
  }

  findOne(id: number) {
    return `This action returns a #${id} poDeliveryMaterial`;
  }

  update(id: number, updatePoDeliveryMaterialDto: UpdatePoDeliveryMaterialDto) {
    return `This action updates a #${id} poDeliveryMaterial`;
  }

  remove(id: number) {
    return `This action removes a #${id} poDeliveryMaterial`;
  }
}
