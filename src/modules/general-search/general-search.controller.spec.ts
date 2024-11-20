import { Test, TestingModule } from '@nestjs/testing';
import { GeneralSearchController } from './general-search.controller';
import { GeneralSearchService } from './general-search.service';

describe('GeneralSearchController', () => {
  let controller: GeneralSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralSearchController],
      providers: [GeneralSearchService],
    }).compile();

    controller = module.get<GeneralSearchController>(GeneralSearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
