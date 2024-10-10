import { Test, TestingModule } from '@nestjs/testing';
import { InspectionRequestService } from './inspection-request.service';

describe('InspectionRequestService', () => {
  let service: InspectionRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InspectionRequestService],
    }).compile();

    service = module.get<InspectionRequestService>(InspectionRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
