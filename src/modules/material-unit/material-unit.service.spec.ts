import { Test, TestingModule } from '@nestjs/testing';
import { MaterialUnitService } from './material-unit.service';

describe('MaterialUnitService', () => {
  let service: MaterialUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialUnitService],
    }).compile();

    service = module.get<MaterialUnitService>(MaterialUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
