-- DropIndex
DROP INDEX "purchase_order_PO_number_key";

-- AlterTable
ALTER TABLE "purchase_order" ALTER COLUMN "PO_number" DROP NOT NULL;
