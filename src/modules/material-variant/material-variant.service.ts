import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ExportReceiptStatus,
  MaterialReceiptStatus,
  Prisma,
} from '@prisma/client';
import { isUUID } from 'class-validator';
import { materialPackageInclude } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant, months } from 'src/common/constant/constant';
import { PathConstants } from 'src/common/constant/path.constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { ImageService } from '../image/image.service';
import { MaterialAttributeService } from '../material-attribute/material-attribute.service';
import { MaterialPackageService } from '../material-package/material-package.service';
import { ChartDto } from './dto/chart.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { MaterialStock } from './dto/stock-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

type History = {
  materialReceiptId?: string;
  materialExportReceiptDetailId?: string;
  receiptAdjustmentId?: string;
  quantityByPack: number;
  type: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface MaterialVariant
  extends Prisma.MaterialVariantGetPayload<{
    include: {
      materialAttribute: true;
      material: {
        include: {
          materialUom: true;
        };
      };
      materialPackage: {
        include: {
          materialReceipt: {
            include: {
              materialExportReceiptDetail: {
                include: {
                  materialExportReceipt: true;
                };
              };
              receiptAdjustment: {
                include: {
                  inventoryReportDetail: {
                    include: {
                      inventoryReport: true;
                    };
                  };
                };
              };
              importReceipt: true;
            };
          };
          inventoryStock: true;
        };
      };
    };
  }> {
  history?: History[];
}

@Injectable()
export class MaterialVariantService {
  async findHistoryByIdWithResponse(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Id is invalid');
    }
    const result = (await this.prismaService.materialVariant.findFirst({
      where: { id },
      include: this.materialHistoryInclude,
    })) as MaterialVariant;
    if (!result) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }
    result.history = [];

    result.materialPackage.forEach((materialPackage) => {
      materialPackage?.materialReceipt?.forEach((materialReceipt) => {
        if (materialReceipt.status == MaterialReceiptStatus.AVAILABLE) {
          result.history.push({
            materialReceiptId: materialReceipt.id,
            quantityByPack: materialReceipt.quantityByPack,
            code: materialReceipt.code,
            type: 'IMPORT_RECEIPT',
            createdAt: materialReceipt.createdAt,
            updatedAt: materialReceipt.updatedAt,
          });
          materialReceipt?.materialExportReceiptDetail?.forEach(
            (materialExportReceiptDetail) => {
              console.log(materialExportReceiptDetail);
              console.log(materialExportReceiptDetail.materialExportReceipt);
              result.history.push({
                materialExportReceiptDetailId: materialExportReceiptDetail.id,
                quantityByPack: -materialExportReceiptDetail.quantityByPack,
                code: materialExportReceiptDetail?.materialExportReceipt.code,
                type: 'EXPORT_RECEIPT',
                createdAt: materialExportReceiptDetail.createdAt,
                updatedAt: materialExportReceiptDetail.updatedAt,
              });
            },
          );
          materialReceipt?.receiptAdjustment?.forEach((receiptAdjustment) => {
            result.history.push({
              receiptAdjustmentId: receiptAdjustment.id,
              quantityByPack:
                receiptAdjustment.beforeAdjustQuantity -
                receiptAdjustment.afterAdjustQuantity,
              code: receiptAdjustment?.inventoryReportDetail?.inventoryReport
                .code,
              type: 'RECEIPT_ADJUSTMENT',
              createdAt: receiptAdjustment.createdAt,
              updatedAt: receiptAdjustment.updatedAt,
            });
          });
        }
      });
    });

    result?.history?.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    return apiSuccess(
      HttpStatus.OK,
      result.history,
      'Material variant history',
    );
  }
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageService: ImageService,
    private readonly materialPackageService: MaterialPackageService,
    private readonly materialAttributeService: MaterialAttributeService,
  ) {}

  materialInclude: Prisma.MaterialVariantInclude = {
    materialAttribute: true,
    materialPackage: {
      include: {
        materialReceipt: true,
        inventoryStock: true,
      },
    },
    material: {
      include: {
        materialUom: true,
      },
    },
  };

  materialStockInclude = {
    materialAttribute: true,
    material: {
      include: {
        materialUom: true,
      },
    },
    materialPackage: {
      include: {
        materialReceipt: {
          include: {
            materialExportReceiptDetail: true,
            receiptAdjustment: true,
            importReceipt: true,
          },
        },
        inventoryStock: true, // Make sure to include inventoryStock
      },
    },
  };

  materialHistoryInclude = {
    materialAttribute: true,
    material: {
      include: {
        materialUom: true,
      },
    },
    materialPackage: {
      include: {
        materialReceipt: {
          include: {
            materialExportReceiptDetail: {
              include: {
                materialExportReceipt: true,
              },
            },
            receiptAdjustment: {
              include: {
                inventoryReportDetail: {
                  include: {
                    inventoryReport: true,
                  },
                },
              },
            },
            importReceipt: true,
          },
        },
        inventoryStock: true,
      },
    },
  };

  findByQuery(query: any) {
    return this.prismaService.materialVariant.findFirst({
      where: query,
      include: this.materialInclude,
    });
  }

  async findAllMaterialHasReceipt() {
    return this.prismaService.materialVariant.findMany({
      where: {
        materialPackage: {
          some: {
            materialReceipt: {
              some: {
                status: MaterialReceiptStatus.AVAILABLE,
              },
            },
          },
        },
      },
      include: this.materialInclude,
    });
  }

  async findMaterialHasReceipt(
    findOptions: GeneratedFindOptions<Prisma.MaterialVariantScalarWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialVariant.findMany({
        skip: offset,
        take: limit,
        orderBy: findOptions?.orderBy,
        where: {
          materialPackage: {
            some: {
              materialReceipt: {
                some: {
                  status: MaterialReceiptStatus.AVAILABLE,
                },
              },
            },
          },
        },
        include: this.materialInclude,
      }),
      this.prismaService.materialVariant.count({
        where: {
          materialPackage: {
            some: {
              materialReceipt: {
                some: {
                  status: MaterialReceiptStatus.AVAILABLE,
                },
              },
            },
          },
        },
      }),
    ]);

    data.forEach((material: any) => {
      material.numberOfMaterialPackage = material.materialPackage.length;
      material.onHand = material?.materialPackage?.reduce(
        (totalAcc, materialVariantEl) => {
          let variantTotal = 0;
          //Invenotory stock is 1 - 1 now, if 1 - n then need to change to use reduce
          if (materialVariantEl.inventoryStock) {
            variantTotal = materialVariantEl.inventoryStock.quantityByPack;
          }
          return totalAcc + variantTotal;
        },
        0,
      );
    });

    return apiSuccess(
      HttpStatus.OK,
      {
        data,
        pageMeta: getPageMeta(total, offset, limit),
      },
      'List of Material with Receipt',
    );
  }

  async findMaterialExportReceipt(
    id: string,
    findOptions: GeneratedFindOptions<Prisma.MaterialExportReceiptDetailScalarWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialExportReceiptDetail.findMany({
        skip: offset,
        take: limit,
        orderBy: findOptions?.orderBy,
        where: {
          materialReceipt: {
            materialPackage: {
              materialVariantId: id,
            },
          },
        },
        include: {
          materialReceipt: {
            include: {
              materialPackage: true,
            },
          },
        },
      }),
      this.prismaService.materialExportReceiptDetail.count({
        where: {
          materialReceipt: {
            materialPackage: {
              materialVariantId: id,
            },
          },
        },
      }),
    ]);
    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return apiSuccess(
      HttpStatus.OK,
      dataResponse,
      'List of Material Export Receipt',
    );
  }

  async findMaterialImportReceipt(
    id: string,
    findOptions: GeneratedFindOptions<Prisma.MaterialReceiptScalarWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialReceipt.findMany({
        skip: offset,
        take: limit,
        orderBy: findOptions?.orderBy,
        where: {
          materialPackage: {
            materialVariantId: id,
          },
        },
        include: {
          materialPackage: true,
        },
      }),
      this.prismaService.materialReceipt.count({
        where: {
          materialPackage: {
            materialVariantId: id,
          },
        },
      }),
    ]);

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return apiSuccess(HttpStatus.OK, dataResponse, 'List of Material Receipt');
  }

  async getAllMaterialReceiptOfMaterialPackage(materialPackageId: any) {
    throw new Error('Method not implemented.');
  }

  async getChart(chartDto: ChartDto) {
    const materialVariantIds = chartDto.materialVariantId || [];
    let additionQuery: Prisma.MaterialReceiptWhereInput;
    let additionExportReceiptQuery: Prisma.MaterialExportReceiptDetailWhereInput;

    if (materialVariantIds.length > 0) {
      additionQuery = {
        materialPackage: {
          materialVariantId: {
            in: materialVariantIds,
          },
        },
      };
      additionExportReceiptQuery = {
        materialReceipt: {
          materialPackage: {
            materialVariantId: {
              in: materialVariantIds,
            },
          },
        },
      };
    }
    const { year } = chartDto;
    const monthlyData = [];

    for (let month = 0; month < 12; month++) {
      const from = new Date(year, month, 1);
      const to = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const importMaterialReceipt =
        await this.prismaService.materialReceipt.findMany({
          where: {
            AND: {
              ...additionQuery,
              createdAt: {
                gte: from,
                lte: to,
              },
              status: {
                in: [
                  // MaterialReceiptStatus.PARTIAL_USED,
                  MaterialReceiptStatus.AVAILABLE,
                ],
              },
            },
          },
          include: {
            materialPackage: {
              include: {
                materialVariant: {
                  include: {
                    material: {
                      include: {
                        materialUom: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

      //TODO: Need to check if this is correct after doing materialExportReceipt
      const exportMaterialReceipt =
        await this.prismaService.materialExportReceiptDetail.findMany({
          where: {
            AND: {
              ...additionExportReceiptQuery,
              createdAt: {
                gte: from,
                lte: to,
              },
            },
            materialExportReceipt: {
              status: ExportReceiptStatus.EXPORTED,
            },
          },
          include: {
            materialReceipt: {
              include: {
                materialPackage: {
                  include: materialPackageInclude,
                },
              },
            },
          },
        });

      const totalQuantities = this.calculateTotalQuantities(
        importMaterialReceipt,
        exportMaterialReceipt,
      );
      monthlyData.push({
        month: month + 1,
        data: totalQuantities,
      });
    }

    return apiSuccess(
      HttpStatus.OK,
      {
        monthlyData,
      },
      'Material Receipt found for each month',
    );
  }

  private calculateTotalQuantities(
    materialReceipt: any[],
    exportMaterialReceipt: any[],
  ) {
    const totals: Record<
      string,
      {
        materialVariant: any;
        totalImportQuantityByUom: number;
        totalExportQuantityByUom: number;
        totalImportQuantityByPack: number;
        totalExportQuantityByPack: number;
      }
    > = {};

    materialReceipt.reduce((acc, el) => {
      const materialVariant = el.materialPackage.materialVariant;
      const materialVariantId = materialVariant.id;
      const importQuantity = el.quantityByPack * el.materialPackage.uomPerPack;
      const importQuantityByPack = el.quantityByPack;
      if (acc[materialVariantId]) {
        acc[materialVariantId].totalImportQuantityByUom += importQuantity;
        acc[materialVariantId].totalImportQuantityByPack +=
          importQuantityByPack;
      } else {
        acc[materialVariantId] = {
          materialVariant,
          totalImportQuantityByUom: importQuantity,
          totalImportQuantityByPack: importQuantityByPack,
          totalExportQuantityByPack: 0,
          totalExportQuantityByUom: 0,
        };
      }

      return acc;
    }, totals);

    // console.log(exportMaterialReceipt.materialReceiptDetail);
    exportMaterialReceipt.reduce((acc, el) => {
      console.log(el);
      const materialVariant =
        el.materialReceipt.materialPackage.materialVariant;
      const materialVariantId = materialVariant.id;
      const exportQuantity =
        el.quantityByPack * el.materialReceipt.materialPackage.uomPerPack;
      const exportQuantityByPack = el.quantityByPack;

      if (acc[materialVariantId]) {
        acc[materialVariantId].totalExportQuantityByPack +=
          exportQuantityByPack;
        acc[materialVariantId].totalExportQuantityByUom += exportQuantity;
      } else {
        acc[materialVariantId] = {
          materialVariant,
          totalImportQuantityByUom: 0,
          totalImportQuantityByPack: 0,
          totalExportQuantityByPack: exportQuantityByPack,
          totalExportQuantityByUom: exportQuantity,
        };
      }

      return acc;
    }, totals);

    const result = Object.values(totals);

    return result;
  }

  findMaterialReceiptChart(id: string, months: months[]) {}

  async findMaterialReceiptByIdWithResponse(id: string) {
    const [
      materialImportReceipt,
      materialExportReceipt,
      materialImportReceiptCount,
      materialExportReceiptCount,
    ] = await this.prismaService.$transaction([
      this.prismaService.materialReceipt.findMany({
        where: {
          materialPackage: {
            materialVariantId: id,
          },
        },
        include: {
          materialPackage: true,
        },
      }),
      this.prismaService.materialExportReceipt.findMany({
        //TODO
        // where: {
        //   materialReceipt: {
        //     materialPackage: {
        //       materialVariantId: id,
        //     },
        //   },
        // },
        // include: {
        //   materialReceipt: {
        //     include: {
        //       materialPackage: true,
        //     },
        //   },
        // },
      }),
      this.prismaService.materialReceipt.count({
        where: {
          materialPackage: {
            materialVariantId: id,
          },
        },
      }),
      this.prismaService.materialExportReceipt.count({
        where: {
          //TODO
          // materialReceipt: {
          //   materialPackage: {
          //     materialVariantId: id,
          //   },
          // },
        },
      }),
    ]);

    return apiSuccess(
      HttpStatus.OK,
      {
        materialImportReceipt,
        materialExportReceipt,
        materialImportReceiptCount,
        materialExportReceiptCount,
      },
      'Material Receipt found',
    );
  }

  async findMaterialReceiptByIdWithResponse2(id: string) {
    const [
      materialImportReceipt,
      materialExportReceipt,
      materialImportReceiptCount,
      materialExportReceiptCount,
    ] = await this.prismaService.$transaction([
      this.prismaService.materialReceipt.findMany({
        where: {
          materialPackage: {
            materialVariantId: id,
          },
        },
        include: {
          materialPackage: true,
        },
      }),
      //TODO: Need to check if this is correct after doing materialExportReceipt
      this.prismaService.materialExportReceiptDetail.findMany({
        where: {
          materialReceipt: {
            materialPackage: {
              materialVariantId: id,
            },
          },
        },
        include: {
          materialReceipt: {
            include: {
              materialPackage: true,
            },
          },
        },
      }),
      this.prismaService.materialReceipt.count({
        where: {
          materialPackage: {
            materialVariantId: id,
          },
        },
      }),
      this.prismaService.materialExportReceiptDetail.count({
        where: {
          materialReceipt: {
            materialPackage: {
              materialVariantId: id,
            },
          },
        },
      }),
    ]);

    const result = [];

    materialImportReceipt.forEach((el) => {
      result.push({
        ...el,
        type: 'importReceipt',
      });
    });

    materialExportReceipt.forEach((el) => {
      result.push({
        ...el,
        type: 'exportReceipt',
      });
    });

    return apiSuccess(HttpStatus.OK, result, 'Material Receipt found');
  }

  async search(
    findOptions: GeneratedFindOptions<Prisma.MaterialVariantScalarWhereWithAggregatesInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialVariant.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: this.materialStockInclude,
      }),
      this.prismaService.materialVariant.count({
        where: findOptions?.where,
      }),
    ]);

    data.forEach((material: MaterialStock) => {
      material.numberOfMaterialPackage = material.materialPackage.length;
      material.onHand = material?.materialPackage?.reduce(
        (totalAcc, materialVariantEl) => {
          let variantTotal = 0;
          //Invenotory stock is 1 - 1 now, if 1 - n then need to change to use reduce
          if (materialVariantEl.inventoryStock) {
            variantTotal = materialVariantEl.inventoryStock.quantityByPack;
          }
          return totalAcc + variantTotal;
        },
        0,
      );
    });

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return apiSuccess(HttpStatus.OK, dataResponse, 'List of Material');
  }

  async addImage(file: Express.Multer.File, id: string) {
    const materialVariant = await this.findById(id);
    let oldImageUrl = '';
    if (!materialVariant) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }

    if (materialVariant.image) {
      oldImageUrl = materialVariant.image;
    }

    const imageUrl = await this.imageService.addImageToFirebase(
      file,
      id,
      PathConstants.MATERIAL_PATH,
    );
    let result;
    if (imageUrl) {
      const updateMaterialDto: UpdateMaterialDto = {
        image: imageUrl,
      };
      result = await this.update(id, updateMaterialDto);
    }

    //To ignore this error
    try {
      await this.imageService.deleteImageUrl(oldImageUrl);
    } catch (e) {}

    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Image uploaded successfully');
    }

    return apiFailed(HttpStatus.BAD_REQUEST, 'Image not uploaded');
  }

  async addImageWithoutResponse(file: Express.Multer.File, id: string) {
    const imageUrl = await this.imageService.addImageToFirebase(
      file,
      id,
      PathConstants.MATERIAL_PATH,
    );
    let result;
    if (imageUrl) {
      const updateMaterialDto: UpdateMaterialDto = {
        image: imageUrl,
      };
      result = await this.update(id, updateMaterialDto);
    }
    return result;
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto) {
    const materialVariant = await this.findById(id);
    if (!materialVariant) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }

    const result = await this.prismaService.materialVariant.update({
      where: { id },
      data: updateMaterialDto,
    });

    return result;
  }

  async updateWithResponse(id: string, updateMaterialDto: UpdateMaterialDto) {
    const materialVariant = await this.findById(id);
    if (!materialVariant) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }

    const result = await this.prismaService.materialVariant.update({
      where: { id },
      data: updateMaterialDto,
    });

    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material updated successfully');
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Material not updated');
  }

  async create(
    createMaterialDto: CreateMaterialDto,
    file?: Express.Multer.File,
  ) {
    const { materialId, code, materialPackages, materialAttributes, ...rest } =
      createMaterialDto;

    const materialInput: Prisma.MaterialVariantCreateInput = {
      ...rest,
      code: code ? code.toUpperCase() : undefined,
      material: {
        connect: {
          id: materialId,
        },
      },
    };

    const result = await this.prismaService.materialVariant.create({
      data: materialInput,
      include: this.materialInclude,
    });
    let errorResponse = [];

    try {
      if (createMaterialDto.materialAttributes) {
        const resultAttribute =
          await this.materialAttributeService.createManyWithMaterialVariantId(
            createMaterialDto.materialAttributes,
            result.id,
          );
        result.materialAttribute = resultAttribute;
      }
    } catch (e) {
      errorResponse.push(e);
    }

    try {
      if (createMaterialDto.materialPackages) {
        const resultPackage =
          await this.materialPackageService.createManyWithMaterialVariantId(
            createMaterialDto.materialPackages,
            result.id,
          );
        result.materialPackage = resultPackage;
      }
    } catch (e) {
      errorResponse.push(e);
    }

    try {
      if (file) {
        const imageUrl = await this.addImageWithoutResponse(file, result.id);
        if (imageUrl) {
          result.image = imageUrl.image;
        }
      }
    } catch (e) {
      errorResponse.push(e);
    }

    if (errorResponse.length > 0) {
      if (result) {
        return apiFailed(
          HttpStatus.BAD_REQUEST,
          'Material created successfully but some error occured',
          errorResponse,
        );
      }
    }

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Material created successfully',
      );
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Material not created');
  }

  async findAll() {
    const result = await this.prismaService.materialVariant.findMany({
      include: this.materialInclude,
    });
    return apiSuccess(HttpStatus.OK, result, 'List of Material');
  }

  findAllWithoutResponse() {
    const result = this.prismaService.materialVariant.findMany({
      include: this.materialInclude,
    });
    return result;
  }

  findAllWithoutResponseMinimizeInlude() {
    const result = this.prismaService.materialVariant.findMany({
      // include:{
      //   materialPackage: true,
      // },
    });
    return result;
  }

  findMaterialStock() {
    return this.prismaService.materialVariant.findMany({
      include: {
        materialAttribute: true,
        material: {
          include: {
            materialUom: true,
          },
        },
        materialPackage: {
          include: {
            inventoryStock: true,
          },
        },
      },
    });
  }

  async findByIdWithResponse(id: string) {
    const result = (await this.findById(id)) as MaterialVariant;
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    const result: MaterialStock =
      await this.prismaService.materialVariant.findFirst({
        where: { id },
        include: this.materialStockInclude,
      });
    if (!result) {
      return null;
    }

    if (result.materialPackage) {
      result.numberOfMaterialPackage = result.materialPackage.length
        ? result.materialPackage.length
        : 0;
      result.onHand = result?.materialPackage?.reduce(
        (totalAcc, materialVariantEl) => {
          let variantTotal = 0;
          //Invenotory stock is 1 - 1 now, if 1 - n then need to change to use reduce
          if (materialVariantEl.inventoryStock) {
            variantTotal = materialVariantEl.inventoryStock.quantityByPack;
          }
          return totalAcc + variantTotal;
        },
        0,
      );
    } else {
      result.numberOfMaterialPackage = 0;
      result.onHand = 0;
    }

    return result;
  }

  async findByMaterialCode(materialCode: string) {
    const result = await this.prismaService.materialVariant.findFirst({
      where: { code: materialCode },
      include: this.materialInclude,
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }

  async findByMaterialCodeWithoutResponse(materialCode: string) {
    const result = await this.prismaService.materialVariant.findFirst({
      where: { code: materialCode },
      include: this.materialInclude,
    });
    return result;
  }

  async findByMaterialType(materialType: string) {
    const result = await this.prismaService.materialVariant.findMany({
      where: { material: { id: materialType } },
      include: this.materialInclude,
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }

  async getAllMaterialReceiptOfMaterialVariant(id: string) {
    const result = await this.prismaService.materialReceipt.findMany({
      where: {
        AND: {
          materialPackage: {
            materialVariantId: id,
          },
          status: {
            in: [
              // MaterialReceiptStatus.PARTIAL_USED,
              MaterialReceiptStatus.AVAILABLE,
            ],
          },
        },
      },
    });
    return result;
  }
}
