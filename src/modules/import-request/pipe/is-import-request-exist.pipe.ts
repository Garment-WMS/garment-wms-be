import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class IsImportRequestExistPipe implements PipeTransform {
  constructor(private readonly prismaService: PrismaService) {}
  async transform(value: any) {
    if (!isUUID(value))
      throw new BadRequestException('Import request id must be a UUID');

    const isImportRequestExist =
      !!(await this.prismaService.importRequest.findFirst({
        where: { id: value },
        select: { id: true },
      }));

    if (!isImportRequestExist) {
      throw new BadRequestException('Import request is not exist');
    }
    return value;
  }
}
