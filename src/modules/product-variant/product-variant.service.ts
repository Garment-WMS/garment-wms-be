import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, ProductReceiptStatus } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { PathConstants } from 'src/common/constant/path.constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { ImageService } from '../image/image.service';
import { ChartDto } from './dto/chart-dto.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStock } from './dto/product-stock.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductVariantService {
  constructor(
    private prismaService: PrismaService,
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

  async findProductImportReceipt(
    id: string,
    findOptions: GeneratedFindOptions<Prisma.ProductReceiptScalarWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.productReceipt.findMany({
        skip: offset,
        take: limit,
        where: {
          productSize: {
            productVariantId: id,
          },
        },
        include: {
          productSize: true,
        },
        orderBy: findOptions?.orderBy,
      }),
      this.prismaService.productReceipt.count({
        where: {
          productSize: {
            productVariantId: id,
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

  async create(createProductDto: CreateProductDto) {
    const result = await this.prismaService.productVariant.create({
      data: createProductDto,
    });
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
          if (productSizeEl?.inventoryStock) {
            variantTotal = productSizeEl.inventoryStock.quantityByUom;
          }
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
      product.numberOfProductSize = product.productSize.length;
      product.onHand = product?.productSize?.reduce(
        (totalAcc, productSizeEl) => {
          let variantTotal = 0;
          //Invenotory stock is 1 - 1 now, if 1 - n then need to change to use reduce
          if (productSizeEl?.inventoryStock) {
            variantTotal = productSizeEl.inventoryStock.quantityByUom;
          }
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
