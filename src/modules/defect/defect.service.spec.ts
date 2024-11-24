import { Test, TestingModule } from '@nestjs/testing';
import { DefectService } from './defect.service';

describe('DefectService', () => {
  let service: DefectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefectService],
    }).compile();

    service = module.get<DefectService>(DefectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
