import { Injectable } from '@nestjs/common';
import { CreateProductFormulaMaterialDto } from './dto/create-product-formula-material.dto';
import { UpdateProductFormulaMaterialDto } from './dto/update-product-formula-material.dto';

@Injectable()
export class ProductFormulaMaterialService {
  create(createProductFormulaMaterialDto: CreateProductFormulaMaterialDto) {
    return 'This action adds a new productFormulaMaterial';
  }

  findAll() {
    return `This action returns all productFormulaMaterial`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productFormulaMaterial`;
  }

  update(id: number, updateProductFormulaMaterialDto: UpdateProductFormulaMaterialDto) {
    return `This action updates a #${id} productFormulaMaterial`;
  }

  remove(id: number) {
    return `This action removes a #${id} productFormulaMaterial`;
  }
}
