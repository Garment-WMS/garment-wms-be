import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Prisma, RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAssignDto } from './dto/get-assign.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.taskService.create(createTaskDto),
      'Task has been created successfully',
    );
  }

  @Get()
  async search(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.TaskWhereInput>(
        [],
        [{ createdAt: 'desc' }, { id: 'asc' }],
      ),
    )
    filterDto: FilterDto<Prisma.TaskWhereInput>,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.taskService.search(filterDto.findOptions),
      'Tasks have been retrieved successfully',
    );
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_STAFF, RoleCode.INSPECTION_DEPARTMENT)
  async getMyTasks(@GetUser() authenUser: AuthenUser) {
    return apiSuccess(
      HttpStatus.OK,
      await this.taskService.getByUserToken(authenUser),
      'Tasks have been retrieved successfully',
    );
  }

  @Get('/get-warehouse-staff')
  @UsePipes()
  async getWarehouseStaff(@Body() getAssignDto: GetAssignDto) {
    return apiSuccess(
      HttpStatus.OK,
      await this.taskService.getWarehouseStaffToAssign(
        getAssignDto.expectedStartAt,
        getAssignDto.expectedEndAt,
      ),
      'Warehouse staff have been retrieved successfully',
    );
  }

  @Get('/get-inspection-department')
  async getInspectionDepartment(@Body() getAssignDto: GetAssignDto) {
    return apiSuccess(
      HttpStatus.OK,
      await this.taskService.getInspectionDepartmentToAssign(
        getAssignDto.expectedStartAt,
        getAssignDto.expectedEndAt,
      ),
      'Inspection department have been retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.taskService.findUnique(id),
      'Task has been retrieved successfully',
    );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: CreateTaskDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.taskService.update(id, updateTaskDto),
      'Task has been updated successfully',
    );
  }
}
