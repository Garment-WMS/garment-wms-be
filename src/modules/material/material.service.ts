import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { PathConstants } from 'src/common/constant/path.constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { ImageService } from '../image/image.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { MaterialStock } from './dto/stock-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageService: ImageService,
  ) {}

  materialInclude: Prisma.MaterialInclude = {
    materialAttribute: true,
    materialType: true,
    materialUom: true,
    materialVariant: {
      include: {
        inventoryStock: true,
      },
    },
  };

  materialStockInclude = {
    materialAttribute: true,
    materialType: true,
    materialUom: true,
    materialVariant: {
      include: {
        inventoryStock: true, // Make sure to include inventoryStock
      },
    },
  };

  async search(
    findOptions: GeneratedFindOptions<Prisma.MaterialScalarWhereWithAggregatesInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.material.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: {
          materialAttribute: true,
          materialType: true,
          materialUom: true,
          materialVariant: {
            include: {
              inventoryStock: true,
            },
          },
        },
      }),
      this.prismaService.material.count({
        where: findOptions?.where,
      }),
    ]);

    data.forEach((material: MaterialStock) => {
      material.numberOfMaterialVariant = material.materialVariant.length;
      material.onHand = material?.materialVariant?.reduce(
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
    const material = await this.findById(id);
    let oldImageUrl = '';
    if (!material) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }

    if (material.image) {
      oldImageUrl = material.image;
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
    const material = await this.findById(id);
    if (!material) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }

    const result = await this.prismaService.material.update({
      where: { id },
      data: updateMaterialDto,
    });

    return result;
  }

  async updateWithResponse(id: string, updateMaterialDto: UpdateMaterialDto) {
    const material = await this.findById(id);
    if (!material) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
    }

    const result = await this.prismaService.material.update({
      where: { id },
      data: updateMaterialDto,
    });

    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material updated successfully');
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Material not updated');
  }

  async create(createMaterialDto: CreateMaterialDto) {
    const { materialTypeId, materialUomId, ...rest } = createMaterialDto;

    const materialInput: Prisma.MaterialCreateInput = {
      ...rest,
      materialType: {
        connect: {
          id: materialTypeId,
        },
      },
      materialUom: {
        connect: {
          id: materialUomId,
        },
      },
    };

    const result = await this.prismaService.material.create({
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
    const result = await this.prismaService.material.findMany({
      include: this.materialInclude,
    });
    return apiSuccess(HttpStatus.OK, result, 'List of Material');
  }

  findAllWithoutResponse() {
    const result = this.prismaService.material.findMany({
      include: {
        materialAttribute: true,
        materialType: true,
        materialUom: true,
        materialVariant: {
          include: {
            materialReceipt: true,
            inventoryStock: true,
          },
        },
      },
    });
    return result;
  }

  findMaterialStock() {
    return this.prismaService.material.findMany({
      include: {
        materialAttribute: true,
        materialType: true,
        materialUom: true,
        materialVariant: {
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
    const result: MaterialStock = await this.prismaService.material.findFirst({
      where: { id },
      include: this.materialStockInclude,
    });

    result.numberOfMaterialVariant = result.materialVariant.length;

    result.onHand = result?.materialVariant?.reduce(
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

    return result;
  }

  async findByMaterialCode(materialCode: string) {
    const result = await this.prismaService.material.findFirst({
      where: { code: materialCode },
      include: this.materialInclude,
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }

  async findByMaterialType(materialType: string) {
    const result = await this.prismaService.material.findMany({
      where: { materialType: { id: materialType } },
      include: this.materialInclude,
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }
}
