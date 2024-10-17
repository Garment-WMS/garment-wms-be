import { Prisma } from "@prisma/client";

export interface MaterialStock extends Prisma.MaterialGetPayload<{
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
  }> {
    onHand?: number; // Adding custom field
    numberOfMaterialVariant?: number; // Adding custom field
  }