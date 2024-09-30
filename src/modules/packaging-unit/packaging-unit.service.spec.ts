import { Test, TestingModule } from '@nestjs/testing';
import { PackagingUnitService } from './packaging-unit.service';

describe('PackagingUnitService', () => {
  let service: PackagingUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackagingUnitService],
    }).compile();

    service = module.get<PackagingUnitService>(PackagingUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
