import { Controller, Patch } from '@nestjs/common';
import { UtilService } from './util.service';
@Controller('util')
export class UtilController {
  constructor(private readonly utilService: UtilService) {}

  @Patch('')
  async update() {
    return this.utilService.update();
  }
}
