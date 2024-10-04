import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ImportRequestService } from '../import-request.service';

export class IsImportRequestExistPipe implements PipeTransform {
  constructor(private readonly importRequestService: ImportRequestService) {}
  async transform(value: string) {
    const isImportRequestExist =
      !!(await this.importRequestService.findOne(value));

    if (!isImportRequestExist) {
      throw new BadRequestException('Import request is not exist');
    }
    return value;
  }
}
