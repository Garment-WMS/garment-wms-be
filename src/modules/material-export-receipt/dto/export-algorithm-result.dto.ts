// export type ExportAlgorithmResult =
//   | {
//       id: string;
//       quantityByPack: number;
//     }[]
//   | null;

export type ExportAlgorithmResults = {
  materialVariantId: string;
  targetQuantityUom: number;
  remainingQuantityByPack: number;
  missingQuantityByPack: number;
  needMaterialReceipts: {
    id: string;
    quantityByPack: number;
    uomPerPack: number;
    date: Date | null;
  }[];
  isFullFilled: boolean;
}[];
