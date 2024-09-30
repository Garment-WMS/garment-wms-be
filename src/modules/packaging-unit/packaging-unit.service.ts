import { Injectable } from '@nestjs/common';
import { CreatePackagingUnitDto } from './dto/create-packaging-unit.dto';
import { UpdatePackagingUnitDto } from './dto/update-packaging-unit.dto';

@Injectable()
export class PackagingUnitService {
  create(createPackagingUnitDto: CreatePackagingUnitDto) {
    return 'This action adds a new packagingUnit';
  }

  findAll() {
    return `This action returns all packagingUnit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} packagingUnit`;
  }

  update(id: number, updatePackagingUnitDto: UpdatePackagingUnitDto) {
    return `This action updates a #${id} packagingUnit`;
  }

  remove(id: number) {
    return `This action removes a #${id} packagingUnit`;
  }
}
