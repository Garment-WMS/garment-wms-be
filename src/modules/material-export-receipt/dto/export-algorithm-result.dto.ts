// export type ExportAlgorithmResult =
//   | {
//       id: string;
//       quantityByPack: number;
//     }[]
//   | null;

export type ExportAlgorithmResults = {
  materialVariantId: string;
  targetQuantityUom: number;
  missingQuantityUom: number;
  needMaterialReceipts: {
    id: string;
    quantityByPack: number;
    uomPerPack: number;
    date: Date | null;
  }[];
  isFullFilled: boolean;
}[];
