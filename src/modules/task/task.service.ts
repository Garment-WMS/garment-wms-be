import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

    await this.createMockTodo(task);
    return task;
  }

  async createMockTodo(task: Prisma.TaskWhereUniqueInput) {
    switch (task.taskType) {
      case $Enums.TaskType.INSPECTION:
        const mockTodoInspection: Prisma.TodoCreateManyInput[] = [
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
        ];
        await this.prismaService.todo.createMany({
          data: mockTodoInspection,
          skipDuplicates: true,
        });
        break;
      case $Enums.TaskType.IMPORT:
        const mockTodoImport: Prisma.TodoCreateManyInput[] = [
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
        ];

        await this.prismaService.todo.createMany({
          data: mockTodoImport,
          skipDuplicates: true,
        });
        break;

      case $Enums.TaskType.EXPORT:
        const mockTodoExport: Prisma.TodoCreateManyInput[] = [
          {
            title: 'Verify good package manifests',
            taskId: task.id,
          },
          {
            title: 'Check for quantity of goods before moving out of warehouse',
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
        ];
        await this.prismaService.todo.createMany({
          data: mockTodoExport,
          skipDuplicates: true,
        });
        break;
      case $Enums.TaskType.INVENTORY:
        const mockTodoInventory: Prisma.TodoCreateManyInput[] = [
          {
            title:
              'Check quantity of goods in warehouse storage of your assigned goods',
            taskId: task.id,
          },
          {
            title: 'Create inventory report',
            taskId: task.id,
          },
        ];
        await this.prismaService.todo.createMany({
          data: mockTodoInventory,
          skipDuplicates: true,
        });
        break;
      default:
        Logger.error('Task type not found');
        break;
    }
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

  async updateTaskStatusToDone(taskWhereInput: Prisma.TaskWhereInput) {
    const task = await this.prismaService.task.findFirst({
      where: taskWhereInput,
    });
    if (!task) {
      Logger.error(
        `Cannot auto finish Task with ${JSON.stringify(taskWhereInput)} because of not found`,
      );
    }
    return await this.prismaService.task.update({
      where: { id: task.id },
      data: { status: $Enums.TaskStatus.DONE },
    });
  }
}
