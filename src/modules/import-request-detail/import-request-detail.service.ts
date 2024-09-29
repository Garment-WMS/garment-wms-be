import { Injectable } from '@nestjs/common';
import { CreateImportRequestDetailDto } from './dto/create-import-request-detail.dto';
import { UpdateImportRequestDetailDto } from './dto/update-import-request-detail.dto';

@Injectable()
export class ImportRequestDetailService {
  create(createImportRequestDetailDto: CreateImportRequestDetailDto) {
    return 'This action adds a new importRequestDetail';
  }

  findAll() {
    return `This action returns all importRequestDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} importRequestDetail`;
  }

  update(id: number, updateImportRequestDetailDto: UpdateImportRequestDetailDto) {
    return `This action updates a #${id} importRequestDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} importRequestDetail`;
  }
}
