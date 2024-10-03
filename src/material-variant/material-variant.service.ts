import { Injectable } from '@nestjs/common';
import { CreateMaterialVariantDto } from './dto/create-material-variant.dto';
import { UpdateMaterialVariantDto } from './dto/update-material-variant.dto';

@Injectable()
export class MaterialVariantService {
  create(createMaterialVariantDto: CreateMaterialVariantDto) {
    return 'This action adds a new materialVariant';
  }

  findAll() {
    return `This action returns all materialVariant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialVariant`;
  }

  update(id: number, updateMaterialVariantDto: UpdateMaterialVariantDto) {
    return `This action updates a #${id} materialVariant`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialVariant`;
  }
}
