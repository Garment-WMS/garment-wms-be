import { Injectable } from '@nestjs/common';
import { CreateProductionBatchMaterialVariantDto } from './dto/create-production-batch-material-variant.dto';
import { UpdateProductionBatchMaterialVariantDto } from './dto/update-production-batch-material-variant.dto';

@Injectable()
export class ProductionBatchMaterialVariantService {
  create(createProductionBatchMaterialVariantDto: CreateProductionBatchMaterialVariantDto) {
    return 'This action adds a new productionBatchMaterialVariant';
  }

  findAll() {
    return `This action returns all productionBatchMaterialVariant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productionBatchMaterialVariant`;
  }

  update(id: number, updateProductionBatchMaterialVariantDto: UpdateProductionBatchMaterialVariantDto) {
    return `This action updates a #${id} productionBatchMaterialVariant`;
  }

  remove(id: number) {
    return `This action removes a #${id} productionBatchMaterialVariant`;
  }
}
