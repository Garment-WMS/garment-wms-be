import { Prisma } from '@prisma/client';

export type MaterialStock = Prisma.MaterialVariantGetPayload<{
  include: {
    materialAttribute: true;
    material: {
      include: {
        materialUom: true;
      };
    };
    materialPackage: {
      include: {
        materialReceipt: {
          include: {
            materialExportReceiptDetail: {
              include: {
                materialExportReceipt: true;
              };
            };
          };
        };
        inventoryStock: true;
      };
    };
  };
}> & {
  onHandUom?: number;
  onHand?: number; // Adding custom field
  numberOfMaterialPackage?: number; // Adding custom field
};
