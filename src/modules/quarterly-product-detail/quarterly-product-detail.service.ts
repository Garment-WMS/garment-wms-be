import { Injectable } from '@nestjs/common';
import { CreateQuarterlyProductDetailDto } from './dto/create-quarterly-product-detail.dto';
import { UpdateQuarterlyProductDetailDto } from './dto/update-quarterly-product-detail.dto';

@Injectable()
export class QuarterlyProductDetailService {
  create(createQuarterlyProductDetailDto: CreateQuarterlyProductDetailDto) {
    return 'This action adds a new quarterlyProductDetail';
  }

  findAll() {
    return `This action returns all quarterlyProductDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quarterlyProductDetail`;
  }

  update(id: number, updateQuarterlyProductDetailDto: UpdateQuarterlyProductDetailDto) {
    return `This action updates a #${id} quarterlyProductDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} quarterlyProductDetail`;
  }
}
