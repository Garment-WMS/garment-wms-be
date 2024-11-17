import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma, RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { UpdateProductPlanDto } from './dto/update-product-plan.dto';
import { ProductPlanService } from './product-plan.service';
import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
import { FilterDto } from 'src/common/dto/filter-query.dto';

@Controller('production-plan')
export class ProductPlanController {
  constructor(private readonly productPlanService: ProductPlanService) {}
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.FACTORY_DIRECTOR)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @GetUser() user: AuthenUser) {
    const fileResult: any =
      await this.productPlanService.createProductPlanWithExcelFile(
        file,
        user.factoryDirectorId,
      );
    return fileResult;
  }

  @Get()
  findAll(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.ProductionPlanWhereInput>(
        [],
        [{ id: 'asc', createdAt: 'desc', updatedAt: 'desc' }],
      ),
    )
    filterDto: FilterDto<Prisma.ProductionPlanWhereInput>,
  ) {
    return this.productPlanService.findAll(filterDto.findOptions);;
  }

  @Get(':id')
  findOne(@Param('id', CustomUUIDPipe) id: string) {
    return this.productPlanService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductPlanDto: UpdateProductPlanDto,
  ) {
    return this.productPlanService.update(+id, updateProductPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productPlanService.remove(+id);
  }
}
