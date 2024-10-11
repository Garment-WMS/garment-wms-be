import { NotFoundException } from '@nestjs/common';
import { InspectionRequestService } from '../inspection-request.service';

export class IsInspectionRequestExistPipe {
  constructor(
    private readonly inspectionRequestService: InspectionRequestService,
  ) {}
  async transform(inspectionRequestId: string) {
    const inspectionRequest =
      await this.inspectionRequestService.findFirst(inspectionRequestId);
    if (!inspectionRequest) {
      throw new NotFoundException('Inspection request does not exist');
    }
    return inspectionRequest;
  }
}
