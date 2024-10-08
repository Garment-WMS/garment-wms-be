import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ImportRequestService } from '../import-request.service';

@Injectable()
export class IsImportRequestExistPipe implements PipeTransform {
  constructor(private readonly importRequestService: ImportRequestService) {}
  async transform(value: string) {
    const isImportRequestExist =
      !!(await this.importRequestService.findFirst(value));

    if (!isImportRequestExist) {
      throw new BadRequestException('Import request is not exist');
    }
    return value;
  }
}
