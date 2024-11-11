import { Prisma } from "@prisma/client";

export type ProductStock = Prisma.ProductVariantGetPayload<{
    include: {
      productAttribute: true;
      product: {
        include: {
          productUom: true;
        };
      };
      productSize: {
        include: {
          inventoryStock: true;
          productReceipt: true;
        };
      };
    };
  }> & {
    onHand?: number; // Custom field
    numberOfProductSize?: number; // Custom field
  };
  