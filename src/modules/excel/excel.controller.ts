import {
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Res() res) {
    const fileResult: any = await this.excelService.readExcel(file);
    res.send(fileResult);
    //Use this when testing
    // res.set({
    //   'Content-Type':
    //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   'Content-Disposition': `attachment; filename=${file.originalname}`,
    //   'Content-Length': fileResult.length,
    // });
    // res.send(fileResult);
  }
}
