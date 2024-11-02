import { Injectable } from '@nestjs/common';
import { CreateMaterialExportRequestDto } from './dto/create-material-export-request.dto';
import { UpdateMaterialExportRequestDto } from './dto/update-material-export-request.dto';

@Injectable()
export class MaterialExportRequestService {
  create(createMaterialExportRequestDto: CreateMaterialExportRequestDto) {
    return 'This action adds a new materialExportRequest';
  }

  findAll() {
    return `This action returns all materialExportRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialExportRequest`;
  }

  update(id: number, updateMaterialExportRequestDto: UpdateMaterialExportRequestDto) {
    return `This action updates a #${id} materialExportRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialExportRequest`;
  }
}
