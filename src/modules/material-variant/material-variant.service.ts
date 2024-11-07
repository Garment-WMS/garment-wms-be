import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable } from '@nestjs/common';
import { MaterialReceiptStatus, Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant, months } from 'src/common/constant/constant';
import { PathConstants } from 'src/common/constant/path.constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { ImageService } from '../image/image.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { MaterialStock } from './dto/stock-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialVariantService {
 
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageService: ImageService,
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
        materialReceipt: true,
        inventoryStock: true, // Make sure to include inventoryStock
      },
    },
  };

  async getAllMaterialReceiptOfMaterialPackage(materialPackageId: any) {
    throw new Error('Method not implemented.');
  }

  findMaterialReceiptChart(id: string, months: months[]) {
  
  }

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
      this.prismaService.materialExportReceipt.count({
        where: {
          materialReceipt: {
            materialPackage: {
              materialVariantId: id,
            },
          },
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

  async create(createMaterialDto: CreateMaterialDto) {
    const { materialId, code, ...rest } = createMaterialDto;

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
    });
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
    const result = await this.findById(id);
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
              MaterialReceiptStatus.PARTIAL_USED,
              MaterialReceiptStatus.AVAILABLE,
            ],
          },
        },
      },
    });
    return result;
  }
}
