import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { ImportRequestService } from '../import-request.service';

@Injectable()
export class IsImportRequestExistPipe implements PipeTransform {
  constructor(private readonly importRequestService: ImportRequestService) {}
  async transform(value: any) {
    if (!isUUID(value))
      throw new BadRequestException('Import request id must be a UUID');

    const isImportRequestExist =
      !!(await this.importRequestService.findFirst(value));

    if (!isImportRequestExist) {
      throw new BadRequestException('Import request is not exist');
    }
    return value;
  }
}
