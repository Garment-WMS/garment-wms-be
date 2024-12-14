import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMaterialExportRequestDetailDto } from './dto/create-material-export-request-detail.dto';
import { UpdateMaterialExportRequestDetailDto } from './dto/update-material-export-request-detail.dto';

@Injectable()
export class MaterialExportRequestDetailService {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    createMaterialExportRequestDetailDto: CreateMaterialExportRequestDetailDto,
  ) {
    return 'This action adds a new materialExportRequestDetail';
  }

  findAll() {
    return `This action returns all materialExportRequestDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialExportRequestDetail`;
  }

  update(
    id: number,
    updateMaterialExportRequestDetailDto: UpdateMaterialExportRequestDetailDto,
  ) {
    return `This action updates a #${id} materialExportRequestDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialExportRequestDetail`;
  }
}
