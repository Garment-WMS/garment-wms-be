import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InventoryReportStatus, Prisma, PrismaClient } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiSuccess } from 'src/common/dto/api-response';
import { getPageMeta } from 'src/common/utils/utils';
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
    inventoryReportPlanDetail: {
      include: {
        inventoryReportPlan: true,
      },
    },
  };

  async findAllByWarehouseStaff(
    findOptions: GeneratedFindOptions<Prisma.InventoryReportWhereInput>,
    warehouseStaffId: string,
  ) {
    const { skip, take, ...rest } = findOptions;
    const page = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;

    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.inventoryReport.findMany({
        where: {
          AND: [
            {
              warehouseStaffId,
              ...rest?.where,
            },
          ],
        },
        include: this.includeQuery,
        skip: page,
        take: limit,
      }),
      this.prismaService.inventoryReport.count({
        where: {
          AND: [
            {
              warehouseStaffId,
              ...rest?.where,
            },
          ],
        },
      }),
    ]);
    return apiSuccess(
      HttpStatus.OK,
      {
        data: result,
        pageMeta: getPageMeta(total, page, limit),
      },
      'List of Purchase Order',
    );
  }

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
    let materialReceipt = [];
    let productReceipt = [];
    if (createInventoryReportDto.materialPackageId) {
      materialReceipt =
        await this.materialReceiptService.getAllMaterialReceiptOfMaterialPackage(
          createInventoryReportDto.materialPackageId,
        );

      if (!materialReceipt) {
        throw new Error('Material Receipt not found');
      }
    }

    //TODO: Product receipt
    if (createInventoryReportDto.productSizeId) {
      // const productReceipt = await this.
    }

    const createInventoryReportDetailDto: CreateInventoryReportDetailDto[] = [];

    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaClient) => {
        const createInventoryReportInput: Prisma.InventoryReportCreateInput = {
          code: undefined,
          from: new Date(),
          note: createInventoryReportDto.note,
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

        if (materialReceipt.length > 0) {
          materialReceipt.forEach((materialReceipt) => {
            createInventoryReportDetailDto.push({
              materialReceiptId: materialReceipt.id,
              expectedQuantity: materialReceipt.remainQuantityByPack,
              inventoryReportId: inventoryReport.id,
              actualQuantity: undefined,
            });
          });
        }
        if (productReceipt.length > 0) {
          productReceipt.forEach((materialReceipt) => {
            createInventoryReportDetailDto.push({
              // materialReceiptId: materialReceipt.id,
              productReceiptId: materialReceipt.id,
              expectedQuantity: materialReceipt.remainQuantityByPack,
              inventoryReportId: inventoryReport.id,
              actualQuantity: undefined,
            });
          });
        }

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

        if (createInventoryReportDto.inventoryReportPlanDetailId) {
          await prismaInstance.inventoryReportPlanDetail.update({
            where: { id: createInventoryReportDto.inventoryReportPlanDetailId },
            data: {
              inventoryReport: {
                connect: { id: inventoryReport.id },
              },
            },
          });
        }

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

  async findAll(
    findOptions: GeneratedFindOptions<Prisma.InventoryReportWhereInput>,
  ) {
    const { skip, take, ...rest } = findOptions;
    const page = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;

    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.inventoryReport.findMany({
        where: rest?.where,
        include: this.includeQuery,
        skip: page,
        take: limit,
      }),
      this.prismaService.inventoryReport.count({
        where: rest?.where,
      }),
    ]);

    return apiSuccess(
      HttpStatus.OK,
      {
        data: result,
        pageMeta: getPageMeta(total, page, limit),
      },
      'Get all inventory report successfully',
    );
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

  async findById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Id is not valid');
    }
    const result = await this.prismaService.inventoryReport.findUnique({
      where: { id },
      include: this.includeQuery,
    });
    return result;
  }

  async update(id: string, updateInventoryReportDto: UpdateInventoryReportDto) {
    return `This action updates a #${id} inventoryReport`;
  }

  async updateStatus(id: string, status: InventoryReportStatus) {
    const inventoryReport = await this.findById(id);

    if (!inventoryReport) {
      throw new BadRequestException('Inventory Report not found');
    }
    const result = await this.prismaService.inventoryReport.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  // async checkLastInventoryReport(inventoryReportPlanId: string) {
  //   const inventoryReport = await this.prismaService.inventoryReport.findMany({
  //     where: {
  //       : inventoryId,
  //       status: {
  //         notIn: [
  //           InventoryReportStatus.EXECUTING,
  //           InventoryReportStatus.PENDING,
  //         ],
  //       },
  //     },
  //   });
  //   if (inventoryReport.length > 0) {
  //     return false;
  //   }
  //   return true;
  // }

  remove(id: number) {
    return `This action removes a #${id} inventoryReport`;
  }
}
