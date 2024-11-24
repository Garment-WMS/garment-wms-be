import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  materialExportReceiptInclude,
  materialExportRequestInclude,
  materialReceiptIncludeWithoutImportReceipt,
  materialVariantInclude,
} from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { CreateMaterialExportReceiptDto } from './dto/create-material-export-receipt.dto';
import { ExportAlgorithmParam } from './dto/export-algorithm-param.type';
import { ExportAlgorithmResult } from './dto/export-algorithm-result.dto';
import { UpdateMaterialExportReceiptDto } from './dto/update-material-export-receipt.dto';
import { ExportAlgorithmEnum } from './enum/export-algorithm.enum';
import { ExportAlgorithmService } from './export-algorithm.service';

@Injectable()
export class MaterialExportReceiptService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exportAlgorithmService: ExportAlgorithmService,
  ) {}
  async create(createMaterialExportReceiptDto: CreateMaterialExportReceiptDto) {
    const input: Prisma.MaterialExportReceiptUncheckedCreateInput = {
      type: createMaterialExportReceiptDto.type,
      note: createMaterialExportReceiptDto.note,
      warehouseStaffId: createMaterialExportReceiptDto.warehouseStaffId,
      materialExportReceiptDetail: {
        createMany: {
          data: createMaterialExportReceiptDto.materialExportReceiptDetail.map(
            (detail) => ({
              materialReceiptId: detail.materialReceiptId,
              quantityByPack: detail.quantityByPack,
            }),
          ),
          skipDuplicates: true,
        },
      },
    };

    return this.prismaService.materialExportReceipt.create({
      data: input,
      include: materialExportReceiptInclude,
    });
  }

  async search(
    findOptions: GeneratedFindOptions<Prisma.MaterialExportReceiptWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialExportReceipt.findMany({
        ...findOptions,
        include: materialExportReceiptInclude,
      }),
      this.prismaService.materialExportReceipt.count({
        where: findOptions?.where,
      }),
    ]);
    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };
    return dataResponse;
  }

  async findUnique(id: string) {
    const materialExportReceipt =
      this.prismaService.materialExportReceipt.findUnique({
        where: { id },
        include: materialExportReceiptInclude,
      });
    if (!materialExportReceipt) {
      throw new Error('Material export receipt not found');
    }
    return materialExportReceipt;
  }

  async getRecommendedMaterialExportReceipt(
    materialExportRequestId: string,
    exportAlgorithmEnum: ExportAlgorithmEnum,
  ) {
    const materialExportRequest =
      await this.prismaService.materialExportRequest.findUnique({
        where: {
          id: materialExportRequestId,
        },
        include: materialExportRequestInclude,
      });
    if (!materialExportRequest) {
      throw new Error('Material export request not found');
    }
    const materialVariantIds: string[] =
      materialExportRequest.materialExportRequestDetail.map(
        (detail) => detail.materialVariantId,
      );

    // Get all material receipts that have material variants in the material export request
    const materialReceipts = await this.prismaService.materialReceipt.findMany({
      where: {
        materialPackage: {
          materialVariantId: {
            in: materialVariantIds,
          },
        },
      },
      include: materialReceiptIncludeWithoutImportReceipt,
    });

    // Handle the algorithm
    let algorithmResult: ExportAlgorithmResult;

    algorithmResult = await this.handleAlgorithm(
      materialExportRequest.materialExportRequestDetail,
      exportAlgorithmEnum,
    );

    const recommendMaterialExportReceiptDetails: Prisma.MaterialExportReceiptDetailUncheckedCreateInput[] =
      algorithmResult.map((result) => ({
        materialExportReceiptId: undefined,
        materialReceiptId: result.id,
        quantityByPack: result.quantityByPack,
        materialReceipt: materialReceipts.find(
          (materialReceipt) => materialReceipt.id === result.id,
        ),
      }));

    return recommendMaterialExportReceiptDetails;
  }

  async handleAlgorithm(
    materialExportRequestDetails: {
      materialVariantId: string;
      quantityByUom: number;
    }[],
    exportAlgorithmEnum: ExportAlgorithmEnum,
  ): Promise<ExportAlgorithmResult> {
    let resultPromises: Promise<
      {
        id: string;
        quantityByPack: number;
      }[]
    >[] = [];
    for (let i = 0; i < materialExportRequestDetails.length; i++) {
      const materialExportRequestDetail = materialExportRequestDetails[i];
      const targetQuantityUom = materialExportRequestDetail.quantityByUom;
      const exportAlgorithmParam: ExportAlgorithmParam = {
        targetQuantityUom,
        items: [],
      };
      const materialReceiptOfMaterialVariant =
        await this.prismaService.materialReceipt.findMany({
          where: {
            materialPackage: {
              materialVariantId: materialExportRequestDetail.materialVariantId,
            },
          },
          include: materialReceiptIncludeWithoutImportReceipt,
        });
      for (let i = 0; i < materialReceiptOfMaterialVariant.length; i++) {
        const materialReceipt = materialReceiptOfMaterialVariant[i];
        const quantityByPack = materialReceipt.remainQuantityByPack;
        const uomPerPack = materialReceipt.materialPackage.uomPerPack;
        let date;
        switch (exportAlgorithmEnum) {
          case ExportAlgorithmEnum.FIFO:
            date = materialReceipt.importDate;
            break;
          case ExportAlgorithmEnum.LIFO:
            date = materialReceipt.importDate;
            break;
          case ExportAlgorithmEnum.FEFO:
            date = materialReceipt.expireDate;
            break;
          default:
            throw new Error('Invalid export algorithm');
        }

        exportAlgorithmParam.items.push({
          id: materialReceipt.id,
          quantityByPack,
          uomPerPack,
          date,
        });
      }
      switch (exportAlgorithmEnum) {
        case ExportAlgorithmEnum.FIFO:
          resultPromises.push(
            this.exportAlgorithmService.getBestQuantityByPackFIFO(
              exportAlgorithmParam.targetQuantityUom,
              exportAlgorithmParam.items,
            ),
          );
          break;
        case ExportAlgorithmEnum.LIFO:
          resultPromises.push(
            this.exportAlgorithmService.getBestQuantityByPackFIFO(
              exportAlgorithmParam.targetQuantityUom,
              exportAlgorithmParam.items,
            ),
          );
          break;
        case ExportAlgorithmEnum.FEFO:
          resultPromises.push(
            this.exportAlgorithmService.getBestQuantityByPackFIFO(
              exportAlgorithmParam.targetQuantityUom,
              exportAlgorithmParam.items,
            ),
          );
          break;
        default:
          throw new Error('Invalid export algorithm');
      }
    }
    try {
      const result = await Promise.all(resultPromises);
      Logger.debug('Log after promise', result);
      // flatten array of arrays
      if (result.some((item) => item === null)) {
        throw new ConflictException('Not enough material');
      }
      return result.flat();
    } catch (error) {
      throw error;
    }
  }

  update(
    id: string,
    updateMaterialExportReceiptDto: UpdateMaterialExportReceiptDto,
  ) {
    return `This action updates a #${id} materialExportReceipt`;
  }

  remove(id: string) {
    return `This action removes a #${id} materialExportReceipt`;
  }

  async getRecommendedMaterialExportReceiptByFormula(
    productFormulaId: string,
    quantityToProduce: number,
    exportAlgorithmEnum: ExportAlgorithmEnum,
  ) {
    const productFormulaMaterials =
      await this.prismaService.productFormulaMaterial.findMany({
        where: {
          productFormulaId: productFormulaId,
        },
        include: {
          materialVariant: { include: materialVariantInclude },
        },
      });
    if (!productFormulaMaterials) {
      throw new Error('Product formula not found');
    }
    const materialExportRequestDetails: {
      materialVariantId: string;
      quantityByUom: number;
    }[] = productFormulaMaterials.map((productFormulaMaterial) => ({
      materialVariantId: productFormulaMaterial.materialVariantId,
      quantityByUom: productFormulaMaterial.quantityByUom * quantityToProduce,
    }));
    const algorithmResult = await this.handleAlgorithm(
      materialExportRequestDetails,
      exportAlgorithmEnum,
    );

    const materialReceipts = await this.prismaService.materialReceipt.findMany({
      where: {
        materialPackage: {
          materialVariantId: {
            in: materialExportRequestDetails.map(
              (detail) => detail.materialVariantId,
            ),
          },
        },
      },
      include: materialReceiptIncludeWithoutImportReceipt,
    });

    const recommendMaterialExportReceiptDetails: Prisma.MaterialExportReceiptDetailUncheckedCreateInput[] =
      algorithmResult.map((result) => ({
        materialExportReceiptId: undefined,
        materialReceiptId: result.id,
        quantityByPack: result.quantityByPack,
        materialReceipt: materialReceipts.find(
          (materialReceipt) => materialReceipt.id === result.id,
        ),
      }));

    return recommendMaterialExportReceiptDetails;
  }
}
