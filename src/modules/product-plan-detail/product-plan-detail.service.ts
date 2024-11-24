import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductPlanDetailDto } from './dto/create-product-plan-detail.dto';
import { UpdateProductPlanDetailDto } from './dto/update-product-plan-detail.dto';

@Injectable()
export class ProductPlanDetailService {
  constructor(private readonly prismaService: PrismaService) {}

  async IsExceedQuantityPlanDetail(
    productionPlanDetailId: string,
    quantityToProduce: number,
  ) {
    const result = await this.prismaService.productionPlanDetail.findFirst({
      where: {
        id: productionPlanDetailId,
      },
      include: {
        productionBatch: true,
      },
    });

    let numberOfProduce = result.productionBatch.reduce(
      (accumulator, productionBatch) => {
        return accumulator + productionBatch.quantityToProduce;
      },
      0,
    );
    return numberOfProduce + quantityToProduce > result.quantityToProduce;
  }

  async createMany(
    createProductPlanDetailDto,
    prismaInstance: PrismaClient = this.prismaService,
  ) {
    const result = await prismaInstance.productionPlanDetail.createMany({
      data: createProductPlanDetailDto,
    });

    return result;
  }

  async findQuery(query: any) {
    const result = await this.prismaService.productionPlanDetail.findFirst({
      where: query,
    });
    return result;
  }

  create(createProductPlanDetailDto: CreateProductPlanDetailDto) {
    return 'This action adds a new productPlanDetail';
  }

  findAll() {
    return `This action returns all productPlanDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productPlanDetail`;
  }

  update(id: number, updateProductPlanDetailDto: UpdateProductPlanDetailDto) {
    return `This action updates a #${id} productPlanDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} productPlanDetail`;
  }
}
