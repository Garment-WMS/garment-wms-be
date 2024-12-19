import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MaterialVariantService } from '../material-variant.service';

@Injectable()
export class IsMaterialExistPipe implements PipeTransform {
  constructor(
    private readonly materialVarariantService: MaterialVariantService,
  ) {}
  async transform(value: string) {
    const isMaterialExist =
      !!(await this.materialVarariantService.findById(value));

    if (!isMaterialExist) {
      throw new BadRequestException('Material is not exist');
    }
    return value;
  }
}
