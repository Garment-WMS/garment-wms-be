import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { CreateMaterialAttributeDto } from './dto/create-material-attribute.dto';
import { UpdateMaterialAttributeDto } from './dto/update-material-attribute.dto';

@Injectable()
export class MaterialAttributeService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createMaterialAttributeDto: CreateMaterialAttributeDto) {
    const result = await this.prismaService.materialAttribute.create({
      data: createMaterialAttributeDto,
    });

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Material Attribute created successfully',
      );
    }

    return apiFailed(
      HttpStatus.BAD_REQUEST,
      null,
      'Material Attribute creation failed',
    );
  }

  findAll() {
    return `This action returns all materialAttribute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialAttribute`;
  }

  async update(
    id: string,
    updateMaterialAttributeDto: UpdateMaterialAttributeDto,
  ) {
    const updatedAttribute = await this.prismaService.materialAttribute.update({
      where: { id: id },
      data: updateMaterialAttributeDto,
    });
    if (updatedAttribute) {
      return apiSuccess(
        HttpStatus.OK,
        updatedAttribute,
        'Material Attribute updated successfully',
      );
    }
    return apiFailed(
      HttpStatus.BAD_REQUEST,
      null,
      'Material Attribute update failed',
    );
  }

  async remove(id: string) {
    const deletedAttribute = await this.prismaService.materialAttribute.delete({
      where: { id: id },
    });

    if (deletedAttribute) {
      return apiSuccess(
        HttpStatus.OK,
        deletedAttribute,
        'Material Attribute deleted successfully',
      );
    }
    return apiFailed(
      HttpStatus.BAD_REQUEST,
      null,
      'Material Attribute deletion failed',
    );
  }
}
