import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { CreateInventoryReportDto } from './dto/create-inventory-report.dto';
import { UpdateInventoryReportDto } from './dto/update-inventory-report.dto';
import { InventoryReportService } from './inventory-report.service';

@Controller('inventory-report')
@ApiTags('Inventory Report')
export class InventoryReportController {
  constructor(
    private readonly inventoryReportService: InventoryReportService,
  ) {}

  @Post('/material-variant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_MANAGER)
  @UsePipes(new ValidationPipe())
  create(
    @Body() createInventoryReportDto: CreateInventoryReportDto,
    @GetUser() user: AuthenUser,
  ) {
    return this.inventoryReportService.create(
      createInventoryReportDto,
      user.warehouseManagerId,
    );
  }

  @Get()
  findAll() {
    return this.inventoryReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryReportService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryReportDto: UpdateInventoryReportDto,
  ) {
    return this.inventoryReportService.update(+id, updateInventoryReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryReportService.remove(+id);
  }
}
