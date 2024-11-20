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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Prisma, RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';
import { ProductionBatchService } from './production-batch.service';

@ApiTags('production-batch')
@Controller('production-batch')
export class ProductionBatchController {
  constructor(
    private readonly productionBatchService: ProductionBatchService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.PRODUCTION_DEPARTMENT)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @GetUser() user: AuthenUser) {
    const fileResult: any =
      await this.productionBatchService.createProductBatchWithExcelFile(
        file,
        user.productionDepartmentId,
      );
    return fileResult;
  }
  @Get()
  async search(
    @Query(
      new AllFilterPipeUnsafe(
        ['productionPlanDetail.id', 'productionPlanDetail.code'],
        [{ createdAt: 'desc' }],
      ),
    )
    filterDto: FilterDto<Prisma.ProductionBatchWhereInput>,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.productionBatchService.search(filterDto.findOptions),
      'Production batch searched successfully',
    );
  }

  @Get(':id')
  async findUnique(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.productionBatchService.findUnique(id),
      'Production batch fetched successfully',
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductionBatchDto: UpdateProductionBatchDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.productionBatchService.update(id, updateProductionBatchDto),
      'Production batch updated successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.productionBatchService.remove(id),
      'Production batch deleted successfully',
    );
  }
}
