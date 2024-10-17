import { Test, TestingModule } from '@nestjs/testing';
import { InspectionDepartmentService } from './inspection-department.service';

describe('InspectionDepartmentService', () => {
  let service: InspectionDepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InspectionDepartmentService],
    }).compile();

    service = module.get<InspectionDepartmentService>(InspectionDepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
