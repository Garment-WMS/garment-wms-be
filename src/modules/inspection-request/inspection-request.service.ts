import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { $Enums, Prisma, PrismaClient, RoleCode } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { inspectionRequestInclude } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { ManagerProcessDto } from '../import-request/dto/import-request/manager-process.dto';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { TaskService } from '../task/task.service';
import { CreateInspectionRequestDto } from './dto/create-inspection-request.dto';
import { UpdateInspectionRequestDto } from './dto/update-inspection-request.dto';
import { ChatService } from '../chat/chat.service';
import { CreateChatDto } from '../chat/dto/create-chat.dto';

@Injectable()
export class InspectionRequestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly taskService: TaskService,
    private readonly chatService: ChatService
  ) {}

  async search(
    findOptions: GeneratedFindOptions<Prisma.InspectionRequestWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;

    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.inspectionRequest.findMany({
        where: findOptions?.where,
        skip: offset,
        take: limit,
        include: inspectionRequestInclude,
      }),
      this.prismaService.inspectionRequest.count({
        where: findOptions?.where,
      }),
    ]);

    const dataResponse: DataResponse = {
      data: result,
      pageMeta: getPageMeta(total, offset, limit),
    };
    return dataResponse;
  }

  async getStatistics(type?: $Enums.InspectionRequestType) {
    const [total, inspecting, inspected] =
      await this.prismaService.$transaction([
        this.prismaService.inspectionRequest.count({
          where: {
            type: type,
          },
        }),
        this.prismaService.inspectionRequest.count({
          where: {
            type: type,
            status: $Enums.InspectionRequestStatus.INSPECTING,
          },
        }),
        this.prismaService.inspectionRequest.count({
          where: {
            type: type,
            status: $Enums.InspectionRequestStatus.INSPECTED,
          },
        }),
      ]);

    return { total, inspecting, inspected };
  }

  private async getInspectionRequestTypeByImportRequestId(
    importRequestId: string,
  ) {
    const importRequest = await this.prismaService.importRequest.findUnique({
      select: {
        type: true,
      },
      where: {
        id: importRequestId,
      },
    });

    if (!importRequest)
      throw new ConflictException(
        `Get Inspection Request Type failed because Import Request Id ${importRequestId} not found`,
      );

    if (importRequest.type.toString().startsWith('PRODUCT')) {
      return $Enums.InspectionRequestType.PRODUCT;
    } else {
      return $Enums.InspectionRequestType.MATERIAL;
    }
  }

  async create(
    createInspectionRequestDto: CreateInspectionRequestDto,
    prismaClient?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const inspectionRequestCreateInput: Prisma.InspectionRequestCreateInput = {
      importRequest: {
        connect: {
          id: createInspectionRequestDto.importRequestId,
        },
      },
      inspectionDepartment: {
        connect: {
          id: createInspectionRequestDto.inspectionDepartmentId,
        },
      },
      purchasingStaff: createInspectionRequestDto.purchasingStaffId
        ? {
            connect: {
              id: createInspectionRequestDto.purchasingStaffId,
            },
          }
        : undefined,
      warehouseManager: createInspectionRequestDto.warehouseManagerId
        ? {
            connect: {
              id: createInspectionRequestDto.warehouseManagerId,
            },
          }
        : undefined,
      status: createInspectionRequestDto.status,
      note: createInspectionRequestDto.note,
      code: undefined,
      type: await this.getInspectionRequestTypeByImportRequestId(
        createInspectionRequestDto.importRequestId,
      ),
    };
    const [inspectionRequest, importRequest] =
      await this.prismaService.$transaction([
        this.prismaService.inspectionRequest.create({
          data: inspectionRequestCreateInput,
          include: inspectionRequestInclude,
        }),
        this.prismaService.importRequest.update({
          where: {
            id: createInspectionRequestDto.importRequestId,
          },
          data: {
            status: $Enums.ImportRequestStatus.INSPECTING,
          },
        }),
      ]);

      const chat :CreateChatDto ={
        discussionId: '',
        message: ''
      }

    return inspectionRequest;
  }

  async createInspectionRequestByImportRequest(
    warehouseManagerId: string,
    managerProcess: ManagerProcessDto,
    importRequest: Prisma.ImportRequestWhereUniqueInput,
  ) {
    const createInspectionRequestDto: CreateInspectionRequestDto = {
      importRequestId: importRequest.id,
      inspectionDepartmentId: managerProcess.inspectionDepartmentId,
      warehouseManagerId: warehouseManagerId,
      note: managerProcess.InspectionNote,
    };

    let inspectionRequest = await this.create(createInspectionRequestDto);
    const task = await this.createTaskByInspectionRequest(
      inspectionRequest.inspectionDepartmentId,
      inspectionRequest.id,
    );
    Logger.log(task);
    return inspectionRequest;
  }

  async createTaskByInspectionRequest(
    inspectionDepartmentId: string,
    inspectionRequestId: string,
  ) {
    const createTaskDto: CreateTaskDto = {
      taskType: 'INSPECTION',
      inspectionDepartmentId: inspectionDepartmentId,
      inspectionRequestId: inspectionRequestId,
      status: 'OPEN',
    };
    const task = await this.taskService.create(createTaskDto);
    return task;
  }

  async findAll() {
    return this.prismaService.inspectionRequest.findMany();
  }

  async findUnique(id: string) {
    const inspectionRequest =
      await this.prismaService.inspectionRequest.findUnique({
        where: {
          id: id,
        },
        include: inspectionRequestInclude,
      });
    if (!inspectionRequest)
      throw new NotFoundException(`Inspection Request with id ${id} not found`);
    return inspectionRequest;
  }

  async findFirst(id: string) {
    const inspectionRequest =
      await this.prismaService.inspectionRequest.findFirst({
        where: {
          id: id,
        },
        include: inspectionRequestInclude,
      });
    return inspectionRequest;
  }

  async getEnum() {
    return {
      InspectionRequestStatus: $Enums.InspectionRequestStatus,
      InspectionRequestType: $Enums.InspectionRequestType,
    };
  }

  async update(
    id: string,
    updateInspectionRequestDto: UpdateInspectionRequestDto,
  ) {
    const inspectionRequestUpdateInput: Prisma.InspectionRequestUpdateInput = {
      status: updateInspectionRequestDto.status,
      note: updateInspectionRequestDto.note,
    };

    if (updateInspectionRequestDto.importRequestId) {
      inspectionRequestUpdateInput.importRequest = {
        connect: {
          id: updateInspectionRequestDto.importRequestId,
        },
      };
    }

    if (updateInspectionRequestDto.inspectionDepartmentId) {
      inspectionRequestUpdateInput.inspectionDepartment = {
        connect: {
          id: updateInspectionRequestDto.inspectionDepartmentId,
        },
      };
    }

    if (updateInspectionRequestDto.purchasingStaffId) {
      inspectionRequestUpdateInput.purchasingStaff = {
        connect: {
          id: updateInspectionRequestDto.purchasingStaffId,
        },
      };
    }

    const inspectionRequest = await this.prismaService.inspectionRequest.update(
      {
        where: {
          id: id,
        },
        data: inspectionRequestUpdateInput,
        include: inspectionRequestInclude,
      },
    );
    return inspectionRequest;
  }

  async remove(id: string) {
    return this.prismaService.inspectionRequest.delete({
      where: {
        id: id,
      },
    });
  }

  async getByUserToken(
    authenUser: AuthenUser,
    findOptions: GeneratedFindOptions<Prisma.InspectionRequestWhereInput>,
  ) {
    switch (authenUser.role) {
      case RoleCode.WAREHOUSE_MANAGER:
        findOptions.where = {
          warehouseManagerId: authenUser.warehouseManagerId,
        };
        return this.search(findOptions);
      case RoleCode.PURCHASING_STAFF:
        findOptions.where = {
          purchasingStaffId: authenUser.purchasingStaffId,
        };
        return this.search(findOptions);
      case RoleCode.INSPECTION_DEPARTMENT:
        findOptions.where = {
          inspectionDepartmentId: authenUser.inspectionDepartmentId,
        };
        return this.search(findOptions);
      default:
        throw new ForbiddenException('This role is not allowed');
    }
  }
}
