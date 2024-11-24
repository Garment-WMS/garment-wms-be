import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';

@Injectable()
export class DiscussionService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAllImportRequestsAndCreateDiscussion(): Promise<any[]> {
    // Find all import requests
    const importRequests = await this.prismaService.importRequest.findMany();

    // Array to store all created discussions
    const createdDiscussions = [];

    // Create a new discussion for each import request
    for (const importRequest of importRequests) {
      const newDiscussion = await this.prismaService.discussion.create({
        data: {
          importRequestId: importRequest.id,
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
    prismaInstance: PrismaService,
  ) {
    return await prismaInstance.discussion.create({
      data: { ...createDiscussionDto },
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
