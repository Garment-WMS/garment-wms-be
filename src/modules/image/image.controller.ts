import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  UploadedFiles,
  UseFilters,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';

import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from 'src/common/dto/response.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetImageDto } from './dto/get-image.dto';
import { ImageResponse } from './dto/image-response.dto';

@Controller('image')
@ApiTags('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async getImage(@Body() body: GetImageDto) {
    const result = await this.imageService.getImageWithPathAndImageName(
      body.id,
      body.fileName,
      body.pathInput,
    );
    return result;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }

  @Post('/array')
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadAvatarArray(@UploadedFiles() files: Express.Multer.File[]) {
    const result: ImageResponse =
      await this.imageService.handleArrayImagesWithoutApiResponse(
        files,
        'test',
        'test',
      );
    return 'test';
  }
}
