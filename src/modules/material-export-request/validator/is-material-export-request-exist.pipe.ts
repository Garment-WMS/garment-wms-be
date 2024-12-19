import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class IsMaterialExportRequestExistPipe implements PipeTransform {
  constructor(private readonly prismaService: PrismaService) {}
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isUUID(value))
      throw new BadRequestException(
        'Material export request id must be a UUID',
      );
    const materialExportRequest =
      this.prismaService.materialExportRequest.findFirst({
        where: {
          id: value,
        },
        select: {
          id: true,
        },
      });
    if (!materialExportRequest)
      throw new BadRequestException('Material export request not found');
    return value;
  }
}
