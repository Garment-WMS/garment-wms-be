import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MaterialService } from '../material.service';

@Injectable()
export class IsMaterialExistPipe implements PipeTransform {
  constructor(private readonly materialService: MaterialService) {}
  async transform(value: string) {
    const isMaterialExist = !!(await this.materialService.findById(value));

    if (!isMaterialExist) {
      throw new BadRequestException('Material is not exist');
    }
    return value;
  }
}
