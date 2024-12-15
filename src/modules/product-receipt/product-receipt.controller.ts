import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Prisma, RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { CreateProductReceiptDto } from './dto/create-product-receipt.dto';
import { ProductReceiptDisposeArrayDto } from './dto/product-receipt-dispose.dto';
import { UpdateProductReceiptDto } from './dto/update-product-receipt.dto';
import { ProductReceiptService } from './product-receipt.service';

@Controller('product-receipt')
export class ProductReceiptController {
  constructor(private readonly productReceiptService: ProductReceiptService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_MANAGER)
  @Post('/dispose')
  async dispose(
    @Body() ProductReceiptDisposeArrayDto: ProductReceiptDisposeArrayDto,
    @GetUser() warehouseManager: AuthenUser,
  ) {
    return this.productReceiptService.dispose(
      ProductReceiptDisposeArrayDto.productReceipts,
      warehouseManager,
    );
  }

  @Post()
  create(@Body() createProductReceiptDto: CreateProductReceiptDto) {
    return this.productReceiptService.create(createProductReceiptDto);
  }

  @Get()
  findAll(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.ProductReceiptScalarWhereInput>(
        [],
        [{ createdAt: 'desc' }],
      ),
    )
    filterOptions: FilterDto<Prisma.ProductReceiptScalarWhereInput>,
  ) {
    return this.productReceiptService.findAll(filterOptions.findOptions);
  }

  @Get('by-code')
  findByCode(@Query('code') code: string) {
    return this.productReceiptService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productReceiptService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductReceiptDto: UpdateProductReceiptDto,
  ) {
    return this.productReceiptService.update(+id, updateProductReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productReceiptService.remove(+id);
  }
}
