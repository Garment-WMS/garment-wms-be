import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { CreateInventoryReportDetailDto } from '../inventory-report-detail/dto/create-inventory-report-detail.dto';
import { InventoryReportDetailService } from '../inventory-report-detail/inventory-report-detail.service';
import { InventoryReportPlanDto } from '../inventory-report-plan/dto/inventory-report-plan.dto';
import { MaterialReceiptService } from '../material-receipt/material-receipt.service';
import { MaterialVariantService } from '../material-variant/material-variant.service';
import { CreateInventoryReportDto } from './dto/create-inventory-report.dto';
import { UpdateInventoryReportDto } from './dto/update-inventory-report.dto';

@Injectable()
export class InventoryReportService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly materialVariantService: MaterialVariantService,
    private readonly inventoryReportDetailService: InventoryReportDetailService,
    private readonly materialReceiptService: MaterialReceiptService,
  ) {}

  includeQuery: Prisma.InventoryReportInclude = {
    inventoryReportDetail: true,
  };

  async createInventoryReport(
    inventoryReportParam: InventoryReportPlanDto,
    warehouseStaffId: string,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const inventorytReportInput: Prisma.InventoryReportCreateInput = {
      code: undefined,
      from: new Date(),
      note: inventoryReportParam.note,
      warehouseManager: {
        connect: { id: inventoryReportParam.warehouseManagerId },
      },
      warehouseStaff: {
        connect: { id: warehouseStaffId },
      },
    };

    const inventoryReport = await prismaInstance.inventoryReport.create({
      data: inventorytReportInput,
      include: {
        inventoryReportDetail: true,
      },
    });

    if (!inventoryReport) {
      throw new Error('Inventory Report created failed');
    }

    const createInventoryReportDetailDto: CreateInventoryReportDetailDto[] = [];
    const receipt = {
      materialReceipt: [],
      productReceipt: [],
    };

    await Promise.all(
      inventoryReportParam.inventoryReportPlanDetail.map(async (el) => {
        if (el.materialPackageId) {
          const materialReceipt =
            await this.materialReceiptService.getAllMaterialReceiptOfMaterialPackage(
              el.materialPackageId,
            );
          if (materialReceipt.length > 0) {
            receipt.materialReceipt.push(...materialReceipt);
          }
        }
        if (el.productSizeId) {
          //DO LATER
        }
      }),
    );
    console.log('asd', receipt.materialReceipt);
    receipt.materialReceipt.forEach((materialReceipt) => {
      createInventoryReportDetailDto.push({
        materialReceiptId: materialReceipt.id,
        expectedQuantity: materialReceipt.remainQuantityByPack,
        inventoryReportId: inventoryReport.id,
        actualQuantity: undefined,
      });
    });
    console.log(receipt.productReceipt);
    // receipt.productReceipt.forEach((productReceip) => {
    //   createInventoryReportDetailDto.push({
    //     productReceiptId: productReceip.id,
    //     recordedQuantity: productReceip.remainQuantityByPack,
    //     inventoryReportId: inventoryReport.id,
    //     storageQuantity: 0,
    //   });
    // });

    console.log(createInventoryReportDetailDto);

    await this.inventoryReportDetailService.create(
      createInventoryReportDetailDto,
      prismaInstance,
    );

    const inventoryReportDetail =
      await prismaInstance.inventoryReportDetail.findMany({
        where: { inventoryReportId: inventoryReport.id },
      });

    if (!inventoryReportDetail) {
      throw new Error('Inventory Report Detail created failed');
    }

    inventoryReport.inventoryReportDetail = inventoryReportDetail;

    return inventoryReport;
  }

  async create(
    createInventoryReportDto: CreateInventoryReportDto,
    managerId: string,
  ) {
    const materialReceipt =
      await this.materialVariantService.getAllMaterialReceiptOfMaterialVariant(
        createInventoryReportDto.materialVariantId,
      );

    if (!materialReceipt) {
      throw new Error('Material Receipt not found');
    }
    const createInventoryReportDetailDto: CreateInventoryReportDetailDto[] = [];

    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaClient) => {
        const createInventoryReportInput: Prisma.InventoryReportCreateInput = {
          code: undefined,
          from: new Date(),
          note: createInventoryReportDto.note,
          // materialVariant: {
          //   connect: { id: createInventoryReportDto.materialVariantId },
          // },
          warehouseManager: {
            connect: { id: managerId },
          },
          warehouseStaff: {
            connect: { id: createInventoryReportDto.warehouseStaffId },
          },
        };

        const inventoryReport = await prismaInstance.inventoryReport.create({
          data: createInventoryReportInput,
          include: {
            inventoryReportDetail: true,
          },
        });
        if (!inventoryReport) {
          throw new Error('Inventory Report created failed');
        }
        materialReceipt.forEach((materialReceipt) => {
          createInventoryReportDetailDto.push({
            materialReceiptId: materialReceipt.id,
            expectedQuantity: materialReceipt.remainQuantityByPack,
            inventoryReportId: inventoryReport.id,
            actualQuantity: undefined,
          });
        });
        await this.inventoryReportDetailService.create(
          createInventoryReportDetailDto,
          prismaInstance,
        );

        const inventoryReportDetail =
          await prismaInstance.inventoryReportDetail.findMany({
            where: { inventoryReportId: inventoryReport.id },
          });

        if (!inventoryReportDetail) {
          throw new Error('Inventory Report Detail created failed');
        }

        inventoryReport.inventoryReportDetail = inventoryReportDetail;

        return inventoryReport;
      },
    );

    if (!result) {
      throw new Error('Inventory Report created failed');
    }

    return apiSuccess(
      HttpStatus.CREATED,
      result,
      'Inventory report created successfully',
    );
  }

  async findAll() {
    return `This action returns all inventoryReport`;
  }

  async findOne(id: string) {
    const result = await this.prismaService.inventoryReport.findUnique({
      where: { id },
      include: this.includeQuery,
    });

    return apiSuccess(
      HttpStatus.OK,
      result,
      'Get inventory report successfully',
    );
  }

  update(id: number, updateInventoryReportDto: UpdateInventoryReportDto) {
    return `This action updates a #${id} inventoryReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventoryReport`;
  }
}
