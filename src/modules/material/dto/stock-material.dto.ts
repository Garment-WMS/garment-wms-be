import { Prisma } from '@prisma/client';

export type MaterialStock = Prisma.MaterialGetPayload<{
  include: {
    materialAttribute: true;
    materialType: true;
    materialUom: true;
    materialVariant: {
      include: {
        inventoryStock: true;
      };
    };
  };
}> & {
  onHand?: number; // Adding custom field
  numberOfMaterialVariant?: number; // Adding custom field
};
