import { Prisma } from '@prisma/client';

export interface MaterialStock
  extends Prisma.MaterialVariantGetPayload<{
    include: {
      materialAttribute: true;
      material: {
        include: {
          materialUom: true;
        };
      };
      materialPackage: {
        include: {
          inventoryStock: true;
        };
      };
    };
  }> {
  onHand?: number; // Adding custom field
  numberOfMaterialVariant?: number; // Adding custom field
}
