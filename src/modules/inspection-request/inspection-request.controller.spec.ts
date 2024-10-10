import { Test, TestingModule } from '@nestjs/testing';
import { InspectionRequestController } from './inspection-request.controller';
import { InspectionRequestService } from './inspection-request.service';

describe('InspectionRequestController', () => {
  let controller: InspectionRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectionRequestController],
      providers: [InspectionRequestService],
    }).compile();

    controller = module.get<InspectionRequestController>(InspectionRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
