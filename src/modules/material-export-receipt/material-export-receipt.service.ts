import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { materialExportReceiptInclude } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
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

    return this.prismaService.materialExportReceipt.create({
      data: input,
      include: materialExportReceiptInclude,
    });
  }

  async search(
    findOptions: GeneratedFindOptions<Prisma.MaterialExportReceiptWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.materialExportReceipt.findMany({
        ...findOptions,
        include: materialExportReceiptInclude,
      }),
      this.prismaService.materialExportReceipt.count({
        where: findOptions?.where,
      }),
    ]);
    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };
    return dataResponse;
  }

  async findUnique(id: string) {
    const materialExportReceipt =
      this.prismaService.materialExportReceipt.findUnique({
        where: { id },
        include: materialExportReceiptInclude,
      });
    if (!materialExportReceipt) {
      throw new Error('Material export receipt not found');
    }
    return materialExportReceipt;
  }

  update(
    id: string,
    updateMaterialExportReceiptDto: UpdateMaterialExportReceiptDto,
  ) {
    return `This action updates a #${id} materialExportReceipt`;
  }

  remove(id: string) {
    return `This action removes a #${id} materialExportReceipt`;
  }
}
