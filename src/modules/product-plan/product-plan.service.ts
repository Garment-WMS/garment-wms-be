import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { ExcelService } from '../excel/excel.service';
import { ProductPlanDetailService } from '../product-plan-detail/product-plan-detail.service';
import { CreateProductPlanDto } from './dto/create-product-plan.dto';
import { UpdateProductPlanDto } from './dto/update-product-plan.dto';
import { isUUID, IsUUID } from 'class-validator';

@Injectable()
export class ProductPlanService {
  constructor(
    private prismaService: PrismaService,
    private readonly excelService: ExcelService,
    private readonly productPlanDetailService: ProductPlanDetailService,
  ) {}

  includeQuery: Prisma.ProductionPlanInclude = {
    productionPlanDetail: {
      include:{
        productSize: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    productUom: true,
                  },
                },
              },
            },
          },
        },
      }
    },
  };

  async createProductPlanWithExcelFile(
    file: Express.Multer.File,
    factoryDirectorId: string,
  ) {
    const excelData = await this.excelService.readProductionPlanExcel(file);
    if (excelData instanceof ApiResponse) {
      return excelData;
    }

    const createProductPlanData = excelData as CreateProductPlanDto;
    const productPlanInput: Prisma.ProductionPlanCreateInput = {
      factoryDirector: {
        connect: { id: factoryDirectorId },
      },
      name: createProductPlanData.name,
      note: createProductPlanData.note,
      expectedStartDate: createProductPlanData.expectedStartDate,
      expectedEndDate: createProductPlanData.expectedEndDate,
      code: undefined,
    };
    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaClient) => {
        const productionPlanResult: any =
          await prismaInstance.productionPlan.create({
            data: productPlanInput,
          });

        const productPlanItems =
          createProductPlanData.productionPlanDetails.map((item) => {
            const { code, ...rest } = item; // Remove the 'code' field
            return {
              ...rest,
              productionPlanId: productionPlanResult.id,
            };
          });
        const productionPlanDetail =
          await this.productPlanDetailService.createMany(
            productPlanItems,
            prismaInstance,
          );

        productionPlanResult.productionPlanDetails = productionPlanDetail;

        return productionPlanResult;
      },
    );

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Product Plan created successfully',
      );
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to create Product Plan');
  }

  async findAll() {
    const productPlans = await this.prismaService.productionPlan.findMany({
      include: this.includeQuery,
    });

    return apiSuccess(
      HttpStatus.OK,
      productPlans,
      'Get all product plan successfully',
    );
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new Error('Invalid UUID');
    }

    const productPlan = await this.prismaService.productionPlan.findUnique({
      where: { id },
      include: this.includeQuery,
    });

    return apiSuccess(
      HttpStatus.OK,
      productPlan,
      'Get product plan successfully',
    );
  }

  update(id: number, updateProductPlanDto: UpdateProductPlanDto) {
    return `This action updates a #${id} productPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} productPlan`;
  }
}
