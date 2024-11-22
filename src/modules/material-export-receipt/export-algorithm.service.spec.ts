import { Test, TestingModule } from '@nestjs/testing';
import { ExportAlgorithmService } from './export-algorithm.service';

describe('ExportAlgorithmService', () => {
  let service: ExportAlgorithmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportAlgorithmService],
    }).compile();

    service = module.get<ExportAlgorithmService>(ExportAlgorithmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBestQuantityByPack', () => {
    it('should return the best quantity by pack in ascending order', async () => {
      const items = [
        {
          id: '1',
          quantityByPack: 10,
          uomPerPack: 10,
          date: new Date('2023-01-01'),
        },
        {
          id: '2',
          quantityByPack: 20,
          uomPerPack: 10,
          date: new Date('2023-01-02'),
        },
        {
          id: '3',
          quantityByPack: 15,
          uomPerPack: 10,
          date: new Date('2023-01-03'),
        },
      ];
      const targetQuantityUom = 250;
      const result = await service['getBestQuantityByPack'](
        targetQuantityUom,
        items,
        'asc',
      );
      expect(result).toEqual([
        { id: '1', quantityByPack: 10 },
        { id: '2', quantityByPack: 15 },
      ]);
    });

    it('should return the best quantity by pack in descending order', async () => {
      const items = [
        {
          id: '1',
          quantityByPack: 10,
          uomPerPack: 10,
          date: new Date('2023-01-01'),
        },
        {
          id: '2',
          quantityByPack: 20,
          uomPerPack: 10,
          date: new Date('2023-01-02'),
        },
        {
          id: '3',
          quantityByPack: 15,
          uomPerPack: 10,
          date: new Date('2023-01-03'),
        },
      ];
      const targetQuantityUom = 250;
      const result = await service['getBestQuantityByPack'](
        targetQuantityUom,
        items,
        'desc',
      );
      expect(result).toEqual([
        { id: '3', quantityByPack: 15 },
        { id: '2', quantityByPack: 10 },
      ]);
    });
  });

  describe('getBestQuantityByPackFEFO', () => {
    it('should return the best quantity by pack based on FEFO', async () => {
      const items = [
        {
          id: '1',
          quantityByPack: 10,
          uomPerPack: 10,
          expireDate: new Date('2023-01-01'),
        },
        {
          id: '2',
          quantityByPack: 20,
          uomPerPack: 10,
          expireDate: new Date('2023-01-02'),
        },
        {
          id: '3',
          quantityByPack: 15,
          uomPerPack: 10,
          expireDate: new Date('2023-01-03'),
        },
      ];
      const targetQuantityUom = 250;
      const result = await service.getBestQuantityByPackFEFO(
        targetQuantityUom,
        items,
      );
      expect(result).toEqual([
        { id: '1', quantityByPack: 10 },
        { id: '2', quantityByPack: 15 },
      ]);
    });
  });

  describe('getBestQuantityByPackFIFO', () => {
    it('should return the best quantity by pack based on FIFO', async () => {
      const items = [
        {
          id: '1',
          quantityByPack: 10,
          uomPerPack: 10,
          date: new Date('2023-01-01'),
        },
        {
          id: '2',
          quantityByPack: 20,
          uomPerPack: 10,
          date: new Date('2023-01-02'),
        },
        {
          id: '3',
          quantityByPack: 15,
          uomPerPack: 10,
          date: new Date('2023-01-03'),
        },
      ];
      const targetQuantityUom = 250;
      const result = await service.getBestQuantityByPackFIFO(
        targetQuantityUom,
        items,
      );
      expect(result).toEqual([
        { id: '1', quantityByPack: 10 },
        { id: '2', quantityByPack: 15 },
      ]);
    });
  });

  describe('getBestQuantityByPackLIFO', () => {
    it('should return the best quantity by pack based on LIFO', async () => {
      const items = [
        {
          id: '1',
          quantityByPack: 10,
          uomPerPack: 10,
          date: new Date('2023-01-01'),
        },
        {
          id: '2',
          quantityByPack: 20,
          uomPerPack: 10,
          date: new Date('2023-01-02'),
        },
        {
          id: '3',
          quantityByPack: 15,
          uomPerPack: 10,
          date: new Date('2023-01-03'),
        },
      ];
      const targetQuantityUom = 250;
      const result = await service.getBestQuantityByPackLIFO(
        targetQuantityUom,
        items,
      );
      expect(result).toEqual([
        { id: '3', quantityByPack: 15 },
        { id: '2', quantityByPack: 10 },
      ]);
    });
  });

  describe('getBestQuantityByPackFIFO2', () => {
    it('should return the best quantity by pack based on LIFO', async () => {
      const items = [
        {
          id: '1',
          quantityByPack: 1,
          uomPerPack: 1,
          date: new Date('2023-01-01'),
        },
        {
          id: '2',
          quantityByPack: 2,
          uomPerPack: 3,
          date: new Date('2023-01-02'),
        },
        {
          id: '3',
          quantityByPack: 2,
          uomPerPack: 3,
          date: new Date('2023-01-03'),
        },
      ];
      const targetQuantityUom = 250;
      const result = await service.getBestQuantityByPackLIFO(
        targetQuantityUom,
        items,
      );
      expect(result).toEqual([
        { id: '3', quantityByPack: 15 },
        { id: '2', quantityByPack: 10 },
      ]);
    });
  });
});
