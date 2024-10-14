import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { PathConstants } from 'src/common/constant/path.constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ImageService } from '../image/image.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageService: ImageService,
  ) {}

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
      include: {
        materialAttribute: true,
        materialType: true,
        materialUom: true,
      },
    });
    return apiSuccess(HttpStatus.OK, result, 'List of Material');
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
    const result = await this.prismaService.material.findFirst({
      where: { id },
    });
    return result;
  }

  async findByMaterialCode(materialCode: string) {
    const result = await this.prismaService.material.findFirst({
      where: { code: materialCode },
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }

  async findByMaterialType(materialType: string) {
    const result = await this.prismaService.material.findMany({
      where: { materialType: { id: materialType } },
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }
}
