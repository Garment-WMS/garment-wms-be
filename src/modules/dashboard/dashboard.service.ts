import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { InspectionReportService } from '../inspection-report/inspection-report.service';
import { MaterialReceiptService } from '../material-receipt/material-receipt.service';
import { ProductReceiptService } from '../product-receipt/product-receipt.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productReceiptService: ProductReceiptService,
    private readonly materialReceiptService: MaterialReceiptService,
    private readonly inspectionReportService: InspectionReportService,
  ) {}

  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  async findAll(from: Date, to: Date) {
    const materialVariant: any =
      await this.prismaService.materialVariant.findMany({
        include: {
          materialPackage: {
            include: {
              materialReceipt: {
                where: {
                  status: 'AVAILABLE',
                  createdAt: {
                    ...(from ? { gte: from } : {}),
                    ...(to ? { lte: to } : {}),
                  },
                },
              },
            },
          },
        },
      });
    let quantity = 0;
    let numberOfMaterialStock = 0;

    const productVariant: any =
      await this.prismaService.productVariant.findMany({
        include: {
          productSize: {
            include: {
              productReceipt: {
                where: {
                  status: 'AVAILABLE',
                  createdAt: {
                    ...(from ? { gte: from } : {}),
                    ...(to ? { lte: to } : {}),
                  },
                },
              },
            },
          },
        },
      });
    let quantityProduct = 0;
    let numberOfProductStock = 0;
    const inspectionReport: any =
      await this.prismaService.inspectionReport.findMany({
        where: {
          createdAt: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {}),
          },
        },
      });

    productVariant.forEach((item: any) => {
      quantityProduct = 0;
      item.productSize.forEach((productSize) => {
        productSize.productReceipt.forEach((productReceipt) => {
          quantityProduct += productReceipt.quantityByUom;
          numberOfProductStock += productReceipt.quantityByUom;
        });
      });
      console.log('quantity', quantityProduct);
      item.quantity = quantityProduct;
    });

    materialVariant.forEach((item: any) => {
      quantity = 0;
      item.materialPackage.forEach((materialPackage) => {
        materialPackage.materialReceipt.forEach((materialReceipt) => {
          quantity += materialReceipt.quantityByPack;
          numberOfMaterialStock += materialReceipt.quantityByPack;
        });
      });
      item.quantity = quantity;
    });

    return apiSuccess(
      HttpStatus.OK,
      {
        materialVariant,
        productVariant,
        inspectionReport,
        numberOfMaterialStock,
        numberOfProductStock,
      },
      'Get all dashboard successfully',
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
