/*
  Warnings:

  - You are about to drop the column `tax_amount` on the `po_delivery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "po_delivery" DROP COLUMN "tax_amount";

-- AlterTable
ALTER TABLE "purchase_order" ADD COLUMN     "other_amount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "shipping_amount" DOUBLE PRECISION DEFAULT 0;
