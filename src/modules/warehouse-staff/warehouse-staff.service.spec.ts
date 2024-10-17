import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseStaffService } from './warehouse-staff.service';

describe('WarehouseStaffService', () => {
  let service: WarehouseStaffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehouseStaffService],
    }).compile();

    service = module.get<WarehouseStaffService>(WarehouseStaffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
