import { Test, TestingModule } from '@nestjs/testing';
import { InspectionDepartmentController } from './inspection-department.controller';
import { InspectionDepartmentService } from './inspection-department.service';

describe('InspectionDepartmentController', () => {
  let controller: InspectionDepartmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectionDepartmentController],
      providers: [InspectionDepartmentService],
    }).compile();

    controller = module.get<InspectionDepartmentController>(InspectionDepartmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
