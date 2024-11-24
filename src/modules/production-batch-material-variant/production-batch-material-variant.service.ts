import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductionBatchMaterialVariantDto } from './dto/create-production-batch-material-variant.dto';
import { UpdateProductionBatchMaterialVariantDto } from './dto/update-production-batch-material-variant.dto';

@Injectable()
export class ProductionBatchMaterialVariantService {
  constructor(private readonly prismaService: PrismaService) {}
  async createMany(
    id: string,
    productionBatchMaterials: CreateProductionBatchMaterialVariantDto[],
    prismaInstance: PrismaService,
  ) {
    const productionBatchMaterialVariantInput: Prisma.ProductionBatchMaterialVariantCreateManyInput[] =
      [];
    productionBatchMaterials.forEach((productionBatchMaterial) => {
      productionBatchMaterialVariantInput.push({
        productionBatchId: id,
        materialVariantId: productionBatchMaterial.materialVariantId,
        quantityByUom: productionBatchMaterial.quantityByUom,
      });
    });
    return await prismaInstance.productionBatchMaterialVariant.createMany({
      data: productionBatchMaterialVariantInput,
    });
  }
  create(
    createProductionBatchMaterialVariantDto: CreateProductionBatchMaterialVariantDto,
  ) {
    return 'This action adds a new productionBatchMaterialVariant';
  }

  findAll() {
    return `This action returns all productionBatchMaterialVariant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productionBatchMaterialVariant`;
  }

  update(
    id: number,
    updateProductionBatchMaterialVariantDto: UpdateProductionBatchMaterialVariantDto,
  ) {
    return `This action updates a #${id} productionBatchMaterialVariant`;
  }

  remove(id: number) {
    return `This action removes a #${id} productionBatchMaterialVariant`;
  }
}
