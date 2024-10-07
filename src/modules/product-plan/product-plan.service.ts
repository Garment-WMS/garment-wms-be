import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { CreateProductPlanDto } from './dto/create-product-plan.dto';
import { UpdateProductPlanDto } from './dto/update-product-plan.dto';

@Injectable()
export class ProductPlanService {
  constructor(private prismaService: PrismaService) {}

  async create(createProductPlanDto: CreateProductPlanDto) {
    const productPlanInput: Prisma.AnnualProductionPlanCreateInput = {
      year: parseInt(createProductPlanDto.year),
      name: createProductPlanDto.name,
      expectedStartDate: createProductPlanDto.expectedStartDate,
      expectedEndDate: createProductPlanDto.expectedEndDate,
      factoryDirector: {
        create: undefined,
        connect: { id: createProductPlanDto.factoryDirectorId },
      },
    };

    const result = await this.prismaService.annualProductionPlan.create({
      data: productPlanInput,
    });

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Product Plan created successfully',
      );
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to create Product Plan');
  }

  findAll() {
    return `This action returns all productPlan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productPlan`;
  }

  update(id: number, updateProductPlanDto: UpdateProductPlanDto) {
    return `This action updates a #${id} productPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} productPlan`;
  }
}
