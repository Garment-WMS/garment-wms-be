import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed } from 'src/common/dto/api-response';
import { CreateImportRequestDto } from './dto/import-request/create-import-request.dto';
import { UpdateImportRequestDto } from './dto/import-request/update-import-request.dto';

@Injectable()
export class ImportRequestService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createImportRequestDto: CreateImportRequestDto) {
    //check if warehouseManagerId, purchasingStaffId, warehouseStaffId, poDeliveryId exist
    // const isWarehouseManagerExistPromise =
    //   this.prismaService.warehouseManager.findUniqueOrThrow({
    //     where: { id: createImportRequestDto.warehouseManagerId },
    //   });

    // const isPurchasingStaffExistPromise =
    //   this.prismaService.purchasingStaff.findUniqueOrThrow({
    //     where: { id: createImportRequestDto.purchasingStaffId },
    //   });

    // const isWarehouseStaffExistPromise =
    //   this.prismaService.warehouseStaff.findUniqueOrThrow({
    //     where: { id: createImportRequestDto.warehouseStaffId },
    //   });

    // const isPoDeliveryExistPromise =
    //   this.prismaService.poDelivery.findUniqueOrThrow({
    //     where: { id: createImportRequestDto.poDeliveryId },
    //   });

    // const relationPromises = [];
    // if (createImportRequestDto.warehouseManagerId) {
    //   relationPromises.push(isWarehouseManagerExistPromise);
    // }
    // if (createImportRequestDto.purchasingStaffId) {
    //   relationPromises.push(isPurchasingStaffExistPromise);
    // }
    // if (createImportRequestDto.warehouseStaffId) {
    //   relationPromises.push(isWarehouseStaffExistPromise);
    // }
    // relationPromises.push(isPoDeliveryExistPromise);

    // await Promise.allSettled(relationPromises).then((results) => {
    //   let validationErrors: ValidationError[] = [];
    //   results.forEach((result, index) => {
    //     if (result) {
    //       validationErrors.push({
    //         property: index.toString(),
    //         value: undefined,
    //         contexts: {},
    //         children: [],
    //         target: createImportRequestDto,
    //         constraints: { isExist: 'Id not found' },
    //       });
    //     }
    //   });
    //   if (validationErrors.length > 0) {
    //     Logger.verbose('Validation error', validationErrors);
    //     throw new BadRequestException(
    //       apiFailed(HttpStatus.BAD_REQUEST, 'Invalid data', validationErrors),
    //     );
    //   }
    // });

    Logger.verbose('Creating import request', createImportRequestDto);

    const createImportRequestInput: Prisma.ImportRequestCreateInput = {
      warehouseManager: createImportRequestDto.warehouseManagerId
        ? { connect: { id: createImportRequestDto.warehouseManagerId } }
        : undefined,
      purchasingStaff: createImportRequestDto.purchasingStaffId
        ? { connect: { id: createImportRequestDto.purchasingStaffId } }
        : undefined,
      warehouseStaff: createImportRequestDto.warehouseStaffId
        ? { connect: { id: createImportRequestDto.warehouseStaffId } }
        : undefined,
      poDelivery: {
        connect: { id: createImportRequestDto.poDeliveryId },
      },
      status: createImportRequestDto.status,
      description: createImportRequestDto.description,
      rejectReason: createImportRequestDto.rejectReason,
      cancelReason: createImportRequestDto.cancelReason,
      from: createImportRequestDto.from,
      to: createImportRequestDto.to,
      startAt: createImportRequestDto.startAt,
      finishAt: createImportRequestDto.finishAt,
      importRequestDetail: {
        createMany: {
          data: createImportRequestDto.importRequestDetails,
        },
      },
      // type: createImportRequestDto.type,
    };
    return this.prismaService.importRequest.create({
      data: createImportRequestInput,
    });
  }

  findAll() {
    return this.prismaService.importRequest.findMany();
  }

  async findOne(id: string) {
    const importRequest = await this.prismaService.importRequest.findUnique({
      where: { id },
    });
    if (!importRequest) {
      throw new NotFoundException(
        apiFailed(HttpStatus.NOT_FOUND, 'Import request not found'),
      );
    }
    return importRequest;
  }

  update(id: string, updateImportRequestDto: UpdateImportRequestDto) {
    const updateImportRequestInput: Prisma.ImportRequestUpdateInput = {
      ...updateImportRequestDto,
      importRequestDetail: {
        upsert: updateImportRequestDto.importRequestDetails.map((detail) => ({
          where: { id: detail.id },
          create: detail,
          update: detail,
        })),
      },
    };
    return this.prismaService.importRequest.update({
      where: { id },
      data: updateImportRequestInput,
    });
  }

  remove(id: string) {
    return this.prismaService.importRequest.delete({
      where: { id },
    });
  }
}
