export type ExportAlgorithmParam = {
  targetQuantityUom: number;
  items: {
    id: string;
    quantityByPack: number;
    uomPerPack: number;
    date: Date;
  }[];
};
