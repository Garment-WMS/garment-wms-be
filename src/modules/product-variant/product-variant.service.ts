import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, ProductReceiptStatus } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { PathConstants } from 'src/common/constant/path.constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { ProductAttributeService } from 'src/product-attribute/product-attribute.service';
import { ImageService } from '../image/image.service';
import { ProductSizeService } from '../product-size/product-size.service';
import { ChartDto } from './dto/chart-dto.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStock } from './dto/product-stock.dto';
import { UpdateProductDto } from './dto/update-product.dto';

type History = {
  productReceiptId?: string;
  receiptAdjustmentId?: string;
  importReceiptId?: string;
  inventoryReportId?: string;
  quantityByPack: number;
  isDefect: Boolean;
  type: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
};

const includeHistory: Prisma.ProductVariantInclude = {
  productSize: {
    include: {
      productReceipt: {
        include: {
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
    },
  },
};

interface ProductVariantIncludeQuery
  extends Prisma.ProductVariantGetPayload<{
    include: {
      productSize: {
        include: {
          productReceipt: {
            include: {
              receiptAdjustment: {
                include: {
                  productReceipt: true;
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
        };
      };
    };
  }> {
  history?: History[];
}

@Injectable()
export class ProductVariantService {
  async findHistoryDisposedByIdWithResponse(
    id: string,
    sortBy: string,
    filterOption?: GeneratedFindOptions<Prisma.ProductVariantWhereInput>,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }
    const offset = filterOption?.skip || Constant.DEFAULT_OFFSET;
    const limit = filterOption?.take || Constant.DEFAULT_LIMIT;
    const result = (await this.prismaService.productVariant.findFirst({
      where: {
        id: id,
      },
      include: {
        productSize: {
          include: {
            productReceipt: {
              include: {
                importReceipt: true,
                receiptAdjustment: {
                  include: {
                    productReceipt: true,
                    inventoryReportDetail: {
                      include: {
                        inventoryReport: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })) as ProductVariantIncludeQuery;

    result.history = [];

    result.productSize.forEach((productSize) => {
      productSize?.productReceipt?.forEach((productReceipt) => {
        if (productReceipt.status === ProductReceiptStatus.DISPOSED) {
          result.history.push({
            productReceiptId: productReceipt.id,
            importReceiptId: productReceipt.importReceipt?.id,
            quantityByPack: productReceipt.quantityByUom,
            code: productReceipt.importReceipt?.code,
            isDefect: productReceipt.isDefect,
            type: 'DISPOSED',
            createdAt: productReceipt.createdAt,
            updatedAt: productReceipt.updatedAt,
          });
        }
      });
    });

    let length = result.history.length;
    result.history = result?.history
      ?.sort((a, b) => {
        if (sortBy === 'asc') {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
      .slice(offset, offset + limit);

    return apiSuccess(
      HttpStatus.OK,
      {
        data: result.history,
        pageMeta: getPageMeta(length, offset, limit),
      },
      'Product history found',
    );
  }

  async findDisposedProductImportReceipt(
    id: string,
    findOptions: GeneratedFindOptions<Prisma.ProductReceiptScalarWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const whereCondition = {
      ...findOptions?.where,
      status: {
        in: [ProductReceiptStatus.DISPOSED],
      },
      productSize: {
        productVariantId: id,
      },
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.productReceipt.findMany({
        skip: offset,
        take: limit,
        where: whereCondition,
        include: {
          productSize: true,
        },
        orderBy: findOptions?.orderBy,
      }),
      this.prismaService.productReceipt.count({
        where: whereCondition,
      }),
    ]);

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return apiSuccess(
      HttpStatus.OK,
      dataResponse,
      'List of import product receipt',
    );
  }
  async findByIdDisposeWithResponse(id: string) {
    const result = await this.findAllDisposed({
      where: {
        id: id,
      },
      orderBy: undefined,
      skip: undefined,
      take: undefined,
    });
    if (result.data.data.length > 0) {
      return apiSuccess(
        HttpStatus.OK,
        result.data.data[0],
        'Product retrieved successfully',
      );
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Product not found');
  }
  async findAllDisposed(
    filterOption: GeneratedFindOptions<Prisma.ProductVariantScalarWhereInput>,
  ) {
    const { skip, take, ...rest } = filterOption;
    const page = filterOption?.skip || Constant.DEFAULT_OFFSET;
    const limit = filterOption?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.productVariant.findMany({
        skip: page,
        take: limit,
        where: {
          ...rest?.where,
        },
        orderBy: filterOption?.orderBy,
        include: this.includeQueryAny,
      }),
      this.prismaService.productVariant.count({
        where: {
          ...rest?.where,
        },
      }),
    ]);

    let processedProduct = data.map((product: ProductStock) => {
      // Initialize product properties
      product.onHand = 0;
      product.numberOfProductSize = product.productSize.length;

      // Filter and process product sizes
      product.productSize = product.productSize.filter((productSize) => {
        // Initialize product size properties
        let productSizePackageOnHand = 0;

        // Filter receipts with DISPOSED status and calculate onHand
        productSize.productReceipt = productSize.productReceipt.filter(
          (productReceipt) => {
            if (productReceipt.status === ProductReceiptStatus.DISPOSED) {
              productSizePackageOnHand += productReceipt.remainQuantityByUom; // Accumulate onHand directly
              product.onHand += productReceipt.remainQuantityByUom; // Accumulate onHand directly
              return true; // Retain the receipt
            }
            return false; // Discard the receipt
          },
        );

        if (productSize.inventoryStock) {
          productSize.inventoryStock.quantityByUom = productSizePackageOnHand;
        }

        // Return true to keep the productSize if productSizePackageOnHand is greater than 0
        return productSizePackageOnHand > 0;
      });

      return product;
    });

    processedProduct = processedProduct.filter((product) => product.onHand > 0);

    return apiSuccess(
      HttpStatus.OK,
      {
        data: processedProduct,
        pageMeta: getPageMeta(processedProduct.length, page, limit),
      },
      'List of Purchase Order',
    );
  }
  constructor(
    private prismaService: PrismaService,
    private readonly productSizeService: ProductSizeService,
    private readonly productAttributeService: ProductAttributeService,
    private readonly imageService: ImageService,
  ) {}

  includeQuery: Prisma.ProductVariantInclude = {
    productAttribute: true,
    product: {
      include: {
        productUom: true,
      },
    },
    productSize: {
      include: {
        productFormula: {
          include: {
            productFormulaMaterial: {
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
        },
        productReceipt: true,
        inventoryStock: true,
      },
    },
  };

  includeQueryAny = {
    productAttribute: true,
    product: {
      include: {
        productUom: true,
      },
    },
    productSize: {
      include: {
        productReceipt: true,
        inventoryStock: true,
      },
    },
  };

  async findHistoryByIdWithResponse(
    id: string,
    sortBy: string,
    filterOption?: GeneratedFindOptions<Prisma.ProductVariantWhereInput>,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }
    const offset = filterOption?.skip || Constant.DEFAULT_OFFSET;
    const limit = filterOption?.take || Constant.DEFAULT_LIMIT;
    const result = (await this.prismaService.productVariant.findFirst({
      where: {
        id: id,
      },
      include: {
        productSize: {
          include: {
            productReceipt: {
              include: {
                importReceipt: true,
                receiptAdjustment: {
                  include: {
                    productReceipt: true,
                    inventoryReportDetail: {
                      include: {
                        inventoryReport: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })) as ProductVariantIncludeQuery;

    result.history = [];

    result.productSize.forEach((productSize) => {
      productSize?.productReceipt?.forEach((productReceipt) => {
        if (productReceipt.status === ProductReceiptStatus.AVAILABLE) {
          result.history.push({
            productReceiptId: productReceipt.id,
            importReceiptId: productReceipt.importReceipt?.id,
            quantityByPack: productReceipt.quantityByUom,
            code: productReceipt.importReceipt?.code,
            isDefect: productReceipt.isDefect,
            type: 'IMPORT_RECEIPT',
            createdAt: productReceipt.createdAt,
            updatedAt: productReceipt.updatedAt,
          });
        }
        productReceipt?.receiptAdjustment.forEach((receiptAdjustment) => {
          result.history.push({
            receiptAdjustmentId: receiptAdjustment.id,
            inventoryReportId:
              receiptAdjustment?.inventoryReportDetail.inventoryReportId,
            quantityByPack:
              receiptAdjustment.afterAdjustQuantity -
              receiptAdjustment.beforeAdjustQuantity,
            code: receiptAdjustment?.inventoryReportDetail?.inventoryReport
              .code,
            type: 'RECEIPT_ADJUSTMENT',
            isDefect: receiptAdjustment.productReceipt.isDefect,
            createdAt: receiptAdjustment.createdAt,
            updatedAt: receiptAdjustment.updatedAt,
          });
        });
        if (
          productReceipt.status === ProductReceiptStatus.DISPOSED &&
          !productReceipt.isDefect
        ) {
          result.history.push({
            productReceiptId: productReceipt.id,
            importReceiptId: productReceipt.importReceipt?.id,
            quantityByPack: -productReceipt.quantityByUom,
            code: productReceipt.importReceipt?.code,
            isDefect: productReceipt.isDefect,
            type: 'DISPOSED',
            createdAt: productReceipt.createdAt,
            updatedAt: productReceipt.updatedAt,
          });
        }
      });
    });

    let length = result.history.length;
    result.history = result?.history
      ?.sort((a, b) => {
        if (sortBy === 'asc') {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
      .slice(offset, offset + limit);

    return apiSuccess(
      HttpStatus.OK,
      {
        data: result.history,
        pageMeta: getPageMeta(length, offset, limit),
      },
      'Product history found',
    );
  }

  async getChart(chartDto: ChartDto) {
    const productVariantIds = chartDto.productVariantId || [];
    let additionQuery: Prisma.ProductReceiptWhereInput;

    if (productVariantIds.length > 0) {
      additionQuery = {
        productSize: {
          productVariantId: {
            in: productVariantIds,
          },
        },
      };
    }
    const { year } = chartDto;
    const monthlyData = [];

    for (let month = 0; month < 12; month++) {
      const from = new Date(year, month, 1);
      const to = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const importProductReceipt =
        await this.prismaService.productReceipt.findMany({
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
                  ProductReceiptStatus.AVAILABLE,
                ],
              },
            },
          },
          include: {
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
          },
        });

      //TODO: If have productExportReceipt
      const exportProductReceipt = [];
      // await this.prismaService.materialExportReceipt.findMany({
      //   where: {
      //     AND: {
      //       createdAt: {
      //         gte: from,
      //         lte: to,
      //       },
      //     },
      //   },
      //TODO
      // include: {
      //   materialReceipt: {
      //     include: {
      //       materialPackage: {
      //         include: {
      //           materialVariant: true,
      //         },
      //       },
      //     },
      //   },
      // },
      // });

      const totalQuantities = this.calculateTotalQuantities(
        importProductReceipt,
        exportProductReceipt,
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
    productImportReceipt: any[],
    productExportReceipt: any[],
  ) {
    const totals: Record<
      string,
      {
        materialVariant: any;
        totalImportQuantityByUom: number;
        totalExportQuantityByUom: number;
        // totalImportQuantityByPack: number;
        // totalExportQuantityByPack: number;
      }
    > = {};

    productImportReceipt.reduce((acc, el) => {
      const productVariant = el.productSize.productVariant;
      const productVariantId = productVariant.id;
      const importQuantity = el.quantityByUom;
      if (acc[productVariantId]) {
        acc[productVariantId].totalImportQuantityByUom += importQuantity;
      } else {
        acc[productVariantId] = {
          productVariant,
          totalImportQuantityByUom: importQuantity,
          totalExportQuantityByUom: 0,
        };
      }

      return acc;
    }, totals);

    // exportMaterialReceipt.reduce((acc, el) => {
    //   const materialVariant =
    //     el.materialReceipt.materialPackage.materialVariant;
    //   const materialVariantId = materialVariant.id;
    //   const exportQuantity =
    //     el.quantityByPack * el.materialReceipt.materialPackage.uomPerPack;
    //   const exportQuantityByPack = el.quantityByPack;

    //   if (acc[materialVariantId]) {
    //     acc[materialVariantId].totalExportQuantityByPack +=
    //       exportQuantityByPack;
    //     acc[materialVariantId].totalExportQuantityByUom += exportQuantity;
    //   } else {
    //     acc[materialVariantId] = {
    //       materialVariant,
    //       totalImportQuantityByUom: 0,
    //       totalImportQuantityByPack: 0,
    //       totalExportQuantityByPack: exportQuantityByPack,
    //       totalExportQuantityByUom: exportQuantity,
    //     };
    //   }

    //   return acc;
    // }, totals);

    const result = Object.values(totals);

    return result;
  }

  async findProductImportReceipt(id: string, findOptions: any) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const whereCondition = {
      ...findOptions?.where,
      status: {
        notIn: [ProductReceiptStatus.DISPOSED],
        ...findOptions?.where?.status,
      },
      productSize: {
        productVariantId: id,
      },
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.productReceipt.findMany({
        skip: offset,
        take: limit,
        where: whereCondition,
        include: {
          productSize: true,
        },
        orderBy: findOptions?.orderBy,
      }),
      this.prismaService.productReceipt.count({
        where: whereCondition,
      }),
    ]);

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };

    return apiSuccess(
      HttpStatus.OK,
      dataResponse,
      'List of import product receipt',
    );
  }

  findByQuery(query: any) {
    return this.prismaService.productVariant.findFirst({
      where: query,
      include: this.includeQueryAny,
    });
  }

  async addImage(file: Express.Multer.File, id: string) {
    const productVariant = await this.findById(id);
    let oldImageUrl = '';
    if (!productVariant) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Product not found');
    }

    if (productVariant.image) {
      oldImageUrl = productVariant.image;
    }

    const imageUrl = await this.imageService.addImageToFirebase(
      file,
      id,
      PathConstants.PRODUCT_PATH,
    );
    let result;
    if (imageUrl) {
      const updateProductDto: UpdateProductDto = {
        image: imageUrl,
      };
      result = await this.update(id, updateProductDto);
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
      PathConstants.PRODUCT_PATH,
    );
    let result;
    if (imageUrl) {
      const updateProductDto: UpdateProductDto = {
        image: imageUrl,
      };
      result = await this.update(id, updateProductDto);
    }
    return imageUrl;
  }

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    const { productAttributes, productSizes, code, ...rest } = createProductDto;

    const result = await this.prismaService.productVariant.create({
      data: rest,
      include: this.includeQuery,
    });

    if (createProductDto.productAttributes) {
      const productAttribute = await this.productAttributeService.createMany(
        createProductDto.productAttributes,
        result.id,
      );
      result.productAttribute = productAttribute;
    }

    if (createProductDto.productSizes) {
      const productSize = await this.productSizeService.createMany(
        createProductDto.productSizes,
        result,
      );
      result.productSize = productSize;
    }

    if (file) {
      const imageUrl = await this.addImageWithoutResponse(file, result.id);
      if (imageUrl) {
        result.image = imageUrl;
      }
    }

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Product created successfully',
      );
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to create Product');
  }

  async findAllWithoutResponse() {
    const data = await this.prismaService.productVariant.findMany({
      include: this.includeQueryAny,
    });
    return data;
  }

  async findAllWithoutResponseMinimizeInclude() {
    const data = await this.prismaService.productVariant.findMany({});
    return data;
  }

  async findProductHasReceipt() {
    return await this.prismaService.productVariant.findMany({
      where: {
        productSize: {
          some: {
            productReceipt: {
              some: {
                status: { in: [ProductReceiptStatus.AVAILABLE] },
              },
            },
          },
        },
      },
      include: this.includeQueryAny,
    });
  }

  async findAllHasReceipt(
    filterOption?: GeneratedFindOptions<Prisma.ProductVariantWhereInput>,
  ) {
    const { skip, take, ...rest } = filterOption;
    const page = filterOption?.skip || Constant.DEFAULT_OFFSET;
    const limit = filterOption?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.productVariant.findMany({
        skip: page,
        take: limit,
        where: {
          productSize: {
            some: {
              productReceipt: {
                some: {
                  status: { in: [ProductReceiptStatus.AVAILABLE] },
                },
              },
            },
          },
          ...rest?.where,
        },
        orderBy: filterOption?.orderBy,
        include: this.includeQueryAny,
      }),
      this.prismaService.productVariant.count({
        where: {
          productSize: {
            some: {
              productReceipt: {
                some: {
                  status: { in: [ProductReceiptStatus.AVAILABLE] },
                },
              },
            },
          },
          ...rest?.where,
        },
      }),
    ]);

    data.forEach((product: ProductStock) => {
      product.numberOfProductSize = product.productSize.length;
      product.onHand = product?.productSize?.reduce(
        (totalAcc, productSizeEl) => {
          let variantTotal = 0;
          //Invenotory stock is 1 - 1 now, if 1 - n then need to change to use reduce
          // if (productSizeEl?.inventoryStock) {
          //   variantTotal = productSizeEl.inventoryStock.quantityByUom;
          // }

          productSizeEl.productReceipt.forEach((productReceipt) => {
            if (
              productReceipt.status === ProductReceiptStatus.AVAILABLE &&
              productReceipt.isDefect === false
            ) {
              variantTotal += productReceipt.remainQuantityByUom;
            }
          });
          return totalAcc + variantTotal;
        },
        0,
      );
    });

    return apiSuccess(
      HttpStatus.OK,
      {
        data: data,
        pageMeta: getPageMeta(total, page, limit),
      },
      'List of Purchase Order',
    );
  }

  async findAll(
    filterOption?: GeneratedFindOptions<Prisma.ProductVariantWhereInput>,
  ) {
    const { skip, take, ...rest } = filterOption;
    const page = filterOption?.skip || Constant.DEFAULT_OFFSET;
    const limit = filterOption?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.productVariant.findMany({
        skip: page,
        take: limit,
        where: {
          ...rest?.where,
        },
        orderBy: filterOption?.orderBy,
        include: this.includeQueryAny,
      }),
      this.prismaService.productVariant.count({
        where: {
          ...rest?.where,
        },
      }),
    ]);

    data.forEach((product: ProductStock) => {
      product.onHandDisqualified = 0;
      product.onHandQualified = 0;
      product.numberOfProductSize = product.productSize.length;
      product.productSize.forEach((productSize) => {
        productSize.productReceipt.forEach((productReceipt) => {
          if (
            productReceipt.status === ProductReceiptStatus.AVAILABLE &&
            productReceipt.isDefect === false
          ) {
            product.onHandQualified += productReceipt.remainQuantityByUom;
          }
          if (
            productReceipt.status === ProductReceiptStatus.AVAILABLE &&
            productReceipt.isDefect === true
          ) {
            product.onHandDisqualified += productReceipt.remainQuantityByUom;
          }
        });
      });
      product.onHand = product?.productSize?.reduce(
        (totalAcc, productSizeEl) => {
          let variantTotal = 0;
          //Invenotory stock is 1 - 1 now, if 1 - n then need to change to use reduce
          // if (productSizeEl?.inventoryStock) {
          //   variantTotal = productSizeEl.inventoryStock.quantityByUom;
          // }
          productSizeEl.productReceipt.forEach((productReceipt) => {
            if (
              productReceipt.status === ProductReceiptStatus.AVAILABLE &&
              productReceipt.isDefect === false
            ) {
              variantTotal += productReceipt.remainQuantityByUom;
            }
          });

          return totalAcc + variantTotal;
        },
        0,
      );
    });
    return apiSuccess(
      HttpStatus.OK,
      {
        data: data,
        pageMeta: getPageMeta(total, page, limit),
      },
      'List of Purchase Order',
    );
  }

  async findByIdWithResponse(id: string) {
    const result = await this.findById(id);

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Product retrieved successfully',
      );
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Product not found');
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    const result: any = await this.prismaService.productVariant.findUnique({
      where: {
        id: id,
      },
      include: this.includeQuery,
    });

    if (result.productSize) {
      result.onHandQualified = 0;
      result.onHandDisqualified = 0;
      result.productSize.forEach((productSize) => {
        productSize.productReceipt.forEach((productReceipt) => {
          if (
            productReceipt.status === ProductReceiptStatus.AVAILABLE &&
            productReceipt.isDefect === false
          ) {
            console.log(productReceipt.remainQuantityByUom);

            result.onHandQualified += productReceipt.remainQuantityByUom;
          }
          if (
            productReceipt.status === ProductReceiptStatus.AVAILABLE &&
            productReceipt.isDefect === true
          ) {
            result.onHandDisqualified += productReceipt.remainQuantityByUom;
          }
        });
      });
      result.numberOfProductSize = result.productSize
        ? result.productSize.length
        : 0;

      result.onHand = result?.productSize?.reduce((totalAcc, productSizeEl) => {
        let variantTotal = 0;
        //Invenotory stock is 1 - 1 now, if 1 - n then need to change to use reduce
        if (productSizeEl.inventoryStock) {
          variantTotal = productSizeEl.inventoryStock.quantityByUom;
        }
        return totalAcc + variantTotal;
      }, 0);
    } else {
      result.numberOfProductSize = 0;
      result.onHand = 0;
    }

    return result;
  }
  async findDisposedById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    const result: any = await this.prismaService.productVariant.findUnique({
      where: {
        id: id,
      },
      include: this.includeQuery,
    });

    if (result.productSize) {
      result.onHandQualified = 0;
      result.onHandDisqualified = 0;
      result.productSize.forEach((productSize) => {
        productSize.productReceipt.forEach((productReceipt) => {
          if (
            productReceipt.status === ProductReceiptStatus.DISPOSED &&
            productReceipt.isDefect === false
          ) {
            console.log(productReceipt.remainQuantityByUom);

            result.onHandQualified += productReceipt.remainQuantityByUom;
          }
          if (
            productReceipt.status === ProductReceiptStatus.DISPOSED &&
            productReceipt.isDefect === true
          ) {
            result.onHandDisqualified += productReceipt.remainQuantityByUom;
          }
        });
      });
      result.numberOfProductSize = result.productSize
        ? result.productSize.length
        : 0;

      result.onHand = result?.productSize?.reduce((totalAcc, productSizeEl) => {
        let variantTotal = 0;
        //Invenotory stock is 1 - 1 now, if 1 - n then need to change to use reduce
        if (productSizeEl.inventoryStock) {
          variantTotal = productSizeEl.inventoryStock.quantityByUom;
        }
        return totalAcc + variantTotal;
      }, 0);
    } else {
      result.numberOfProductSize = 0;
      result.onHand = 0;
    }

    return result;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const result = await this.prismaService.productVariant.update({
      where: {
        id: id,
      },
      data: updateProductDto,
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Product updated successfully');
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to update Product');
  }

  async remove(id: string) {
    const result = await this.prismaService.productVariant.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Product deleted successfully');
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to delete Product');
  }
}
