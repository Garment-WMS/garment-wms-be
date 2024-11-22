import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMaterialExportReceiptDto } from './dto/create-material-export-receipt.dto';
import { UpdateMaterialExportReceiptDto } from './dto/update-material-export-receipt.dto';

@Injectable()
export class MaterialExportReceiptService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createMaterialExportReceiptDto: CreateMaterialExportReceiptDto) {
    const input: Prisma.MaterialExportReceiptUncheckedCreateInput = {
      type: createMaterialExportReceiptDto.type,
      note: createMaterialExportReceiptDto.note,
      warehouseStaffId: createMaterialExportReceiptDto.warehouseStaffId,
      materialExportReceiptDetail: {
        createMany: {
          data: createMaterialExportReceiptDto.materialExportReceiptDetail.map(
            (detail) => ({
              materialReceiptId: detail.materialReceiptId,
              quantityByPack: detail.quantityByPack,
            }),
          ),
          skipDuplicates: true,
        },
      },
    };
  }

  search() {
    return `This action returns all materialExportReceipt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialExportReceipt`;
  }

  update(
    id: number,
    updateMaterialExportReceiptDto: UpdateMaterialExportReceiptDto,
  ) {
    return `This action updates a #${id} materialExportReceipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialExportReceipt`;
  }
}
