import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateMaterialTypeDto } from './dto/create-material-type.dto';
import { MaterialService } from './material.service';

@Controller('material')
@ApiTags('Material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiResponse({
    status: 201,
    description: 'Material Type created successfully',
  })
  @ApiResponse({ status: 400, description: 'Material Type not created' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({
    status: 409,
    description: 'Material code duplicate',
    example: {
      statusCode: 409,
      data: null,
      message: 'A unique constraint was violated on a record',
      errors: [
        {
          property: ['code'],
          contexts: {},
          children: [],
        },
      ],
    },
  })
  async create(@Body() createMaterialTypeDto: CreateMaterialTypeDto) {
    return await this.materialService.create(createMaterialTypeDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of Material Type' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    return await this.materialService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Material Type found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(@Param('id', CustomUUIDPipe) id: string) {
    return this.materialService.findOne(id);
  }
}
