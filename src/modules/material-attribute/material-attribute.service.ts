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

  update(id: number, updateMaterialAttributeDto: UpdateMaterialAttributeDto) {
    return `This action updates a #${id} materialAttribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialAttribute`;
  }
}
