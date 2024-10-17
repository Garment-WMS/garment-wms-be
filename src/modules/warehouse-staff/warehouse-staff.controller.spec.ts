import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseStaffController } from './warehouse-staff.controller';
import { WarehouseStaffService } from './warehouse-staff.service';

describe('WarehouseStaffController', () => {
  let controller: WarehouseStaffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarehouseStaffController],
      providers: [WarehouseStaffService],
    }).compile();

    controller = module.get<WarehouseStaffController>(WarehouseStaffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
