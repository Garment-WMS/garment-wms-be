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
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { CreateImportReceiptDto } from './dto/create-import-receipt.dto';
import { UpdateImportReceiptDto } from './dto/update-import-receipt.dto';
import { ImportReceiptService } from './import-receipt.service';

@Controller('import-receipt')
@ApiTags('Import Receipt')
export class ImportReceiptController {
  constructor(private readonly importReceiptService: ImportReceiptService) {}

  @Post('/material')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_MANAGER)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(
    @Body() createImportReceiptDto: CreateImportReceiptDto,
    @GetUser() user: AuthenUser,
  ) {
    return this.importReceiptService.createMaterialReceipt(
      createImportReceiptDto,
      user.warehouseManagerId,
    );
  }

  @Get()
  findAll() {
    return this.importReceiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', CustomUUIDPipe) id: string) {
    return this.importReceiptService.findOne(id);
  }

  @Patch('/:id/finish/')
  finishImportReceipt(@Param('id', CustomUUIDPipe) id: string) {
    return this.importReceiptService.finishImportReceipt(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImportReceiptDto: UpdateImportReceiptDto,
  ) {
    return this.importReceiptService.update(+id, updateImportReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importReceiptService.remove(+id);
  }
}
