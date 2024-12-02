import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';

@Injectable()
export class DiscussionService {
  constructor(private readonly prismaService: PrismaService) {}
  async updateExportReceipt(id: string, materialExportRequestId: string) {
    return await this.prismaService.discussion.update({
      where: {
        exportRequestId: materialExportRequestId,
      },
      data: {
        exportReceiptId: id,
      },
    });
  }
  async updateImportReceiptDiscussion(id: string, requestId: string) {
    return await this.prismaService.discussion.update({
      where: {
        importRequestId: requestId,
      },
      data: {
        importReceiptId: id,
      },
    });
  }
  async findAllExportRceiptImportReceiptAndCreateDiscussion() {
    const allImportReceipt = await this.prismaService.importReceipt.findMany({
      include: {
        inspectionReport: {
          include: {
            inspectionRequest: true,
          },
        },
      },
    });

    const allExportReceipt =
      await this.prismaService.materialExportReceipt.findMany();
    for (const importReceipt of allImportReceipt) {
      if (importReceipt.inspectionReport) {
        const newDiscussion = await this.prismaService.discussion.update({
          where: {
            importRequestId:
              importReceipt.inspectionReport.inspectionRequest.importRequestId,
          },
          data: {
            importReceiptId: importReceipt.id,
          },
        });
      }
    }
    for (const exportReceipt of allExportReceipt) {
      if (exportReceipt.materialExportRequestId) {
        const newDiscussion = await this.prismaService.discussion.update({
          where: {
            exportRequestId: exportReceipt.materialExportRequestId,
          },
          data: {
            exportReceiptId: exportReceipt.id,
          },
        });
      }
    }
    return `Discussions created for import requests and export receipts`;
  }

  async findAllImportRequestsAndCreateDiscussion(): Promise<any[]> {
    // Find all import requests
    const importRequests =
      await this.prismaService.materialExportRequest.findMany();

    // Array to store all created discussions
    const createdDiscussions = [];

    // Create a new discussion for each import request
    for (const importRequest of importRequests) {
      const newDiscussion = await this.prismaService.discussion.create({
        data: {
          exportRequestId: importRequest.id,
          // Add more fields as needed, e.g.:
          // createdBy: 'system',
          // status: 'open',
        },
      });
      createdDiscussions.push(newDiscussion);
    }

    return createdDiscussions;
  }

  async create(
    createDiscussionDto: CreateDiscussionDto,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    return await prismaInstance.discussion.create({
      data: { ...createDiscussionDto },
      include: {
        chat: true,
      },
    });
  }

  findAll() {
    return `This action returns all discussion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discussion`;
  }

  update(id: number, updateDiscussionDto: UpdateDiscussionDto) {
    return `This action updates a #${id} discussion`;
  }

  remove(id: number) {
    return `This action removes a #${id} discussion`;
  }
}
