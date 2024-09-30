import { Injectable } from '@nestjs/common';
import { CreateMaterialUnitDto } from './dto/create-material-unit.dto';
import { UpdateMaterialUnitDto } from './dto/update-material-unit.dto';

@Injectable()
export class MaterialUnitService {
  create(createMaterialUnitDto: CreateMaterialUnitDto) {
    return 'This action adds a new materialUnit';
  }

  findAll() {
    return `This action returns all materialUnit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialUnit`;
  }

  update(id: number, updateMaterialUnitDto: UpdateMaterialUnitDto) {
    return `This action updates a #${id} materialUnit`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialUnit`;
  }
}
