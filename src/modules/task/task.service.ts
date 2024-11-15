import { Injectable } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const taskCreateDto: Prisma.TaskCreateInput = {
      ...createTaskDto,
    };

    const task = await this.prismaService.task.create({
      data: taskCreateDto,
    });
    await this.createMockTodo(task);
  }

  async createMockTodo(task: Prisma.TaskWhereUniqueInput) {
    switch (task.taskType) {
      case $Enums.TaskType.IMPORT:
        const mockTodoImport: Prisma.TodoCreateManyInput[] = [
          {
            title: 'Check the import request',
            taskId: task.id,
          },
          {
            title: 'Check the import receipt',
            taskId: task.id,
          },
        ];

        await this.prismaService.todo.createMany({
          data: mockTodoImport,
          skipDuplicates: true,
        });
        break;
    }
  }

  async search() {
    return `This action returns all task`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} task`;
  }
}
