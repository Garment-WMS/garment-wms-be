import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { UpdatePoDeliveryDto } from './dto/update-po-delivery.dto';
import { PoDeliveryService } from './po-delivery.service';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { CancelPoDeliveryDto } from './dto/cancel-po-delivery.dto';

@ApiTags('po-delivery')
@Controller('po-delivery')
export class PoDeliveryController {
  constructor(private readonly poDeliveryService: PoDeliveryService) {}

  @Get(':id')
  getOnePoDelivery(@Param('id', CustomUUIDPipe) id: string) {
    return this.poDeliveryService.getOnePoDelivery(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  updatePoDelivery(
    @Param('id', CustomUUIDPipe) id: string,
    @Body() updatePoDeliveryDto: UpdatePoDeliveryDto,
  ) {
    return this.poDeliveryService.updatePoDelivery(id, updatePoDeliveryDto);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.PURCHASING_STAFF)
  cancelPoDelivery(
    @Body() cancelPoDeliveryDto: CancelPoDeliveryDto,
    @Param('id', CustomUUIDPipe) id: string,
    @GetUser() user: AuthenUser,
  ) {
    return this.poDeliveryService.cancelPoDelivery(id,cancelPoDeliveryDto,user?.purchasingStaffId);
  }

  @Get('/po/:Poid')
  getPoDeliveryByPoId(@Param('Poid', CustomUUIDPipe) Poid: string) {
    return this.poDeliveryService.getPoDeliveryByPoId(Poid);
  }
}
