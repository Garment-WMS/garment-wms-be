import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDefectDto } from './dto/create-defect.dto';
import { UpdateDefectDto } from './dto/update-defect.dto';

@Injectable()
export class DefectService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createDefectDto: CreateDefectDto) {
    return this.prismaService.defect.create({
      data: createDefectDto,
    });
  }

  findAll() {
    return this.prismaService.defect.findMany();
  }

  findOne(id: string) {
    return this.prismaService.defect.findUnique({
      where: { id },
    });
  }

  update(id: number, updateDefectDto: UpdateDefectDto) {
    return `This action updates a #${id} defect`;
  }

  remove(id: number) {
    return `This action removes a #${id} defect`;
  }
}
