import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { PathConstants } from 'src/common/constant/path.constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { getPageMeta } from 'src/common/utils/utils';
import { ImageService } from '../image/image.service';
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
          if (productSizeEl.inventoryStock) {
            variantTotal = productSizeEl.inventoryStock.quantityByPack;
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
    const result = await this.prismaService.productVariant.findUnique({
      where: {
        id: id,
      },
    });
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
