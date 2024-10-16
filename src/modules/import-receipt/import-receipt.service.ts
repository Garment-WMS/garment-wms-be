import { HttpStatus, Injectable } from '@nestjs/common';
import { PoDeliveryStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { InspectionReportService } from '../inspection-report/inspection-report.service';
import { MaterialReceiptService } from '../material-receipt/material-receipt.service';
import { PoDeliveryService } from '../po-delivery/po-delivery.service';
import { CreateImportReceiptDto } from './dto/create-import-receipt.dto';
import { UpdateImportReceiptDto } from './dto/update-import-receipt.dto';

@Injectable()
export class ImportReceiptService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly materialReceiptService: MaterialReceiptService,
    private readonly inspectionReportService: InspectionReportService,
    private readonly poDeliveryService: PoDeliveryService,
  ) {}

  includeQuery: Prisma.ImportReceiptInclude = {
    materialReceipt: true,
    productReceipt: true,
  };

  async createMaterialReceipt(
    createImportReceiptDto: CreateImportReceiptDto,
    managerId: string,
  ) {
    const inspectionReport: any = await this.inspectionReportService.findUnique(
      createImportReceiptDto.inspectionReportId,
    );
    if (!inspectionReport) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Inspection Report not found');
    }
    const importReceiptInput: Prisma.ImportReceiptCreateInput = {
      inspectionReport: {
        connect: {
          id: inspectionReport.id,
        },
      },
      warehouseManager: {
        connect: {
          id: managerId,
        },
      },
      warehouseStaff: {
        connect: {
          id: inspectionReport.inspectionRequest.importRequest.warehouseStaffId,
        },
      },
      code: createImportReceiptDto.code,
      type: 'MATERIAL',
      note: createImportReceiptDto.note,
      startAt: createImportReceiptDto.startAt,
      finishAt: createImportReceiptDto.finishAt,
    };

    const importReceipt = await this.prismaService.importReceipt.create({
      data: importReceiptInput,
    });

    if (importReceipt) {
      const materialReceipts =
        await this.materialReceiptService.createMaterialReceipts(
          importReceipt.id,
          inspectionReport.inspectionReportDetail,
        );
      const poDeliveryUpdate =
        await this.poDeliveryService.updatePoDeliveryMaterialStatus(
          this.prismaService,
          inspectionReport.inspectionRequest.importRequest.poDeliveryId,
          PoDeliveryStatus.FINISHED,
        );
      if (materialReceipts && poDeliveryUpdate) {
        return apiSuccess(
          HttpStatus.CREATED,
          importReceipt,
          'Create import receipt successfully',
        );
      }
    }
    return apiFailed(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Create import receipt failed',
    );
  }

  async findAll() {
    const result = await this.prismaService.importReceipt.findMany({
      include: this.includeQuery,
    });
    return apiSuccess(
      HttpStatus.OK,
      result,
      'Get all import receipt successfully',
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} importReceipt`;
  }

  update(id: number, updateImportReceiptDto: UpdateImportReceiptDto) {
    return `This action updates a #${id} importReceipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} importReceipt`;
  }
}
