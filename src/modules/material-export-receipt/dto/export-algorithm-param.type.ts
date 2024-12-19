// export type ExportAlgorithmParam = {
//   targetQuantityUom: number;
//   items: {
//     id: string;
//     quantityByPack: number;
//     uomPerPack: number;
//     date: Date;
//   }[];
// };

export type ExportAlgorithmParam = {
  materialVariantId: string;
  targetQuantityUom: number;
  allMaterialReceipts: {
    id: string;
    remainQuantityByPack: number;
    uomPerPack: number;
    date: Date | null;
  }[];
}[];
