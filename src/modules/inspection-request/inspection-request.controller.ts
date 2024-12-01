import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { $Enums, Prisma, RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { OptionalParseEnumPipe } from 'src/common/pipe/optional-parse-enum.pipe';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { CreateInspectionRequestDto } from './dto/create-inspection-request.dto';
import { UpdateInspectionRequestDto } from './dto/update-inspection-request.dto';
import { InspectionRequestService } from './inspection-request.service';

@Controller('inspection-request')
@ApiTags('inspection-request')
export class InspectionRequestController {
  constructor(
    private readonly inspectionRequestService: InspectionRequestService,
  ) {}

  @Get()
  async search(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.InspectionRequestWhereInput>(
        [
          'inspectionReport.id',
          'inspectionReport.code',
          'inspectionReport.status',
        ],
        [{ createdAt: 'desc' }],
      ),
    )
    filterOptions: FilterDto<Prisma.InspectionRequestWhereInput>,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionRequestService.search(filterOptions.findOptions),
      'Get import request successfully',
    );
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    RoleCode.WAREHOUSE_MANAGER,
    RoleCode.PURCHASING_STAFF,
    RoleCode.INSPECTION_DEPARTMENT,
  )
  async getByUserToken(
    @GetUser() authenUser: AuthenUser,
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.InspectionRequestWhereInput>(
        [
          'inspectionReport.id',
          'inspectionReport.code',
          'inspectionReport.status',
        ],
        [{ createdAt: 'desc' }],
      ),
    )
    filterDto: FilterDto<Prisma.InspectionRequestWhereInput>,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionRequestService.getByUserToken(
        authenUser,
        filterDto.findOptions,
      ),
      'Get inspection request successfully',
    );
  }

  @Get('enum')
  async getEnum() {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionRequestService.getEnum(),
      'Get import request enum successfully',
    );
  }

  @Get('statistic')
  async getStatistic(
    @Query('type', new OptionalParseEnumPipe($Enums.InspectionRequestType))
    type?: $Enums.InspectionRequestType,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionRequestService.getStatistics(type),
      'Get import request statistic successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id', CustomUUIDPipe) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionRequestService.findUnique(id),
      'Get import request successfully',
    );
  }

  @Post()
  async create(@Body() createInspectionRequestDto: CreateInspectionRequestDto) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.inspectionRequestService.create(createInspectionRequestDto),
      'Create import request successfully',
    );
  }

  @Patch(':id')
  async update(
    @Param('id', CustomUUIDPipe) id: string,
    @Body() updateInspectionRequestDto: UpdateInspectionRequestDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionRequestService.update(
        id,
        updateInspectionRequestDto,
      ),
      'Update import request successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id', CustomUUIDPipe) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionRequestService.remove(id),
      'Delete import request successfully',
    );
  }
}
