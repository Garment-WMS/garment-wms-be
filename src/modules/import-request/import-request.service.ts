import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateImportRequestDto } from './dto/create-import-request.dto';
import { UpdateImportRequestDto } from './dto/update-import-request.dto';

@Injectable()
export class ImportRequestService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createImportRequestDto: CreateImportRequestDto) {
    const createImportRequestInput: Prisma.ImportRequestCreateInput = {
      ...createImportRequestDto,
    };
    return 'This action adds a new importRequest';
  }

  findAll() {
    return `This action returns all importRequest`;
  }

  findOne(id: string) {
    return `This action returns a #${id} importRequest`;
  }

  update(id: string, updateImportRequestDto: UpdateImportRequestDto) {
    return `This action updates a #${id} importRequest`;
  }

  remove(id: string) {
    return `This action removes a #${id} importRequest`;
  }
}
