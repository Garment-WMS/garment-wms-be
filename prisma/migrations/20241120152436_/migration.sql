-- AlterTable
ALTER TABLE "inventory_stock" ADD COLUMN     "quantity_by_uom" DOUBLE PRECISION,
ALTER COLUMN "quantity_by_pack" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_receipt" ADD COLUMN     "remain_quantity_by_uom" DOUBLE PRECISION;
