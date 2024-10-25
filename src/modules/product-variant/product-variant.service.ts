import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { PathConstants } from 'src/common/constant/path.constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ImageService } from '../image/image.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductVariantService {
  constructor(
    private prismaService: PrismaService,
    private readonly imageService: ImageService,
  ) {}

  includeQuery: Prisma.ProductVariantInclude = {
    product: {
      include: {
        productUom: true,
      },
    },
  };

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

  async findAll() {
    const result = await this.prismaService.productVariant.findMany({
      include: this.includeQuery,
    });
    return result;
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
