import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { taskInclude } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const taskCreateInput: Prisma.TaskCreateInput = {
      ...createTaskDto,
    };

    const task = await this.prismaService.task.create({
      data: taskCreateInput,
    });

    // this.mockExpectFinishAt(task);
    await this.createMockTodos(task);
    return task;
  }

  async createMany(
    createTaskDto: CreateTaskDto[],
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const taskCreateInput: Prisma.TaskCreateManyInput[] = createTaskDto.map(
      (task) => {
        return {
          ...task,
        };
      },
    );

    const task = await prismaInstance.task.createManyAndReturn({
      data: taskCreateInput,
    });

    await this.createMockTodos(...task);
    return task;
  }

  // mockExpectFinishAt(task: Task | CreateTaskDto) {
  //   const expectFinishedAt = new Date(task.startedAt);
  //   switch (task.taskType) {
  //     case $Enums.TaskType.INSPECTION:
  //       expectFinishedAt.setMinutes(task.startedAt.getMinutes() + 30);
  //       break;
  //     case $Enums.TaskType.IMPORT:
  //       expectFinishedAt.setMinutes(task.startedAt.getMinutes() + 15);
  //       break;
  //   }
  //   return (task.expectedFinishedAt = expectFinishedAt);
  // }

  async createMockTodos(...tasks: Prisma.TaskWhereUniqueInput[]) {
    let mockTodos: Prisma.TodoCreateManyInput[] = [];
    for (const task of tasks) {
      switch (task.taskType) {
        case $Enums.TaskType.INSPECTION:
          mockTodos.concat([
            {
              title: 'Check for quantity of goods before inspection',
              taskId: task.id,
            },
            {
              title: 'Inspect goods',
              taskId: task.id,
            },
            {
              title: 'Create inspection report',
              taskId: task.id,
            },
            {
              title: 'Double check for quantity of goods after inspection',
              taskId: task.id,
            },
          ]);
        case $Enums.TaskType.IMPORT:
          mockTodos.concat([
            {
              title: 'Verify good package manifests',
              taskId: task.id,
            },
            {
              title: 'Check for quantity of goods before moving to warehouse',
              taskId: task.id,
            },
            {
              title: 'Move goods to warehouse storage',
              taskId: task.id,
            },
            {
              title: 'Place goods in warehouse storage shelves',
              taskId: task.id,
            },
            {
              title:
                'Create double check for quantity of goods after placing in warehouse',
              taskId: task.id,
            },
          ]);
        case $Enums.TaskType.EXPORT:
          mockTodos.concat([
            {
              title: 'Verify good package manifests',
              taskId: task.id,
            },
            {
              title:
                'Check for quantity of goods before moving out of warehouse',
              taskId: task.id,
            },
            {
              title: 'Move goods out of warehouse storage to export storage',
              taskId: task.id,
            },
            {
              title: 'Place goods in delivery truck',
              taskId: task.id,
            },
            {
              title:
                'Double check for quantity of goods after placing in delivery truck',
              taskId: task.id,
            },
          ]);
          break;
        case $Enums.TaskType.INVENTORY:
          mockTodos.concat([
            {
              title:
                'Check quantity of goods in warehouse storage of your assigned goods',
              taskId: task.id,
            },
            {
              title: 'Create inventory report',
              taskId: task.id,
            },
          ]);
          break;
        default:
          Logger.error('Task type not found');
          break;
      }
    }
    return await this.prismaService.todo.createMany({
      data: mockTodos,
    });
  }

  async search(findOptions: GeneratedFindOptions<Prisma.TaskWhereInput>) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.task.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        orderBy: findOptions?.orderBy,
        include: taskInclude,
      }),
      this.prismaService.task.count({
        where: findOptions?.where,
      }),
    ]);

    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };
    return dataResponse;
  }

  async getByUserToken(authenUser: AuthenUser) {
    const task = await this.prismaService.task.findMany({
      where: {
        OR: [
          { warehouseStaffId: authenUser.warehouseStaffId },
          { inspectionDepartmentId: authenUser.inspectionDepartmentId },
        ],
      },
      include: taskInclude,
    });
    return task;
  }

  async findUnique(id: string) {
    const task = await this.prismaService.task.findUnique({
      where: {
        id: id,
      },
      include: taskInclude,
    });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findUnique(id);
    return await this.prismaService.task.update({
      where: { id: task.id },
      data: updateTaskDto,
    });
  }

  async updateTaskStatusToInProgress(
    taskWhereInput: Prisma.TaskWhereInput,
    prismaInstance?: PrismaService,
  ) {
    const prismaService = prismaInstance || this.prismaService;
    const taskToUpdate = await prismaService.task.findFirst({
      where: taskWhereInput,
      select: { id: true },
    });
    if (!taskToUpdate) {
      Logger.error(
        `Cannot auto start Task with ${JSON.stringify(taskWhereInput)} because of not found`,
      );
      return null;
    }
    return await this.prismaService.task.update({
      where: { id: taskToUpdate.id },
      data: { status: $Enums.TaskStatus.IN_PROGRESS, startedAt: new Date() },
    });
  }

  async updateTaskStatusToDone(taskWhereInput: Prisma.TaskWhereInput) {
    const taskToUpdate = await this.prismaService.task.findFirst({
      where: taskWhereInput,
      select: { id: true },
    });
    if (!taskToUpdate) {
      Logger.error(
        `Cannot auto finish Task with ${JSON.stringify(taskWhereInput)} because of not found`,
      );
      return null;
    }
    return await this.prismaService.task.update({
      where: { id: taskToUpdate.id },
      data: { status: $Enums.TaskStatus.DONE, finishedAt: new Date() },
    });
  }

  //only task with status OPEN can be reassigned
  async validateTaskStatusCanReassign(taskWhereInput: Prisma.TaskWhereInput) {
    const tasks = await this.prismaService.task.findMany({
      where: {
        ...taskWhereInput,
        status: {
          notIn: [$Enums.TaskStatus.OPEN],
        },
      },
    });
    if (tasks.length > 0) {
      throw new ConflictException(
        'Cannot reassign task that is not in OPEN status',
      );
    }
  }

  async reassignImportRequestTask(
    importReceiptId: string,
    warehouseStaffId: string,
  ) {
    return await this.prismaService.task.updateMany({
      where: { importReceiptId: importReceiptId },
      data: {
        warehouseStaffId: warehouseStaffId,
      },
    });
  }

  async getWarehouseStaffToAssign(expectedStartAt: Date, expectedEndAt: Date) {
    const [free, busy] = await this.prismaService.$transaction([
      this.prismaService.warehouseStaff.findMany({
        where: {
          task: {
            every: {
              AND: [
                // { status: { notIn: [$Enums.TaskStatus.IN_PROGRESS] } },
                {
                  NOT: {
                    OR: [
                      {
                        startedAt: {
                          gte: expectedStartAt,
                          lte: expectedEndAt,
                        },
                      },
                      {
                        expectedFinishedAt: {
                          gte: expectedStartAt,
                          lte: expectedEndAt,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        include: {
          account: true,
          task: {
            where: {
              status: {
                in: [$Enums.TaskStatus.IN_PROGRESS],
              },
            },
            orderBy: [
              {
                expectedFinishedAt: 'asc',
              },
              {
                startedAt: 'desc',
              },
            ],
          },
        },
      }),
      this.prismaService.warehouseStaff.findMany({
        where: {
          task: {
            some: {
              AND: [{ status: { in: [$Enums.TaskStatus.IN_PROGRESS] } }],
            },
          },
        },
        include: {
          account: true,
          task: {
            where: {
              status: {
                in: [$Enums.TaskStatus.IN_PROGRESS],
              },
            },
            orderBy: [
              {
                expectedFinishedAt: 'asc',
              },
              {
                startedAt: 'desc',
              },
            ],
          },
        },
      }),
    ]);
    return { free, busy };
  }

  async getInspectionDepartmentToAssign(
    expectedStartAt: Date,
    expectedEndAt: Date,
  ) {
    const [free, busy] = await this.prismaService.$transaction([
      this.prismaService.inspectionDepartment.findMany({
        where: {
          task: {
            every: {
              AND: [
                // { status: { notIn: [$Enums.TaskStatus.IN_PROGRESS] } },
                {
                  NOT: {
                    OR: [
                      {
                        startedAt: {
                          gte: expectedStartAt,
                          lte: expectedEndAt,
                        },
                      },
                      {
                        expectedFinishedAt: {
                          gte: expectedStartAt,
                          lte: expectedEndAt,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        include: {
          account: true,
          task: {
            where: {
              status: {
                in: [$Enums.TaskStatus.IN_PROGRESS],
              },
            },
            orderBy: [
              {
                expectedFinishedAt: 'asc',
              },
              {
                startedAt: 'desc',
              },
            ],
          },
        },
      }),
      this.prismaService.inspectionDepartment.findMany({
        where: {
          task: {
            some: {
              AND: [{ status: { in: [$Enums.TaskStatus.IN_PROGRESS] } }],
            },
          },
        },
        include: {
          account: true,
          task: {
            where: {
              status: {
                in: [$Enums.TaskStatus.IN_PROGRESS],
              },
            },
            orderBy: [
              {
                expectedFinishedAt: 'asc',
              },
              {
                startedAt: 'desc',
              },
            ],
          },
        },
      }),
    ]);
    return { free, busy };
  }
}
