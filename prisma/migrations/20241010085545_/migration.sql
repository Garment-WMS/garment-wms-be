/*
  Warnings:

  - You are about to drop the column `order_date` on the `po_delivery` table. All the data in the column will be lost.
  - You are about to drop the column `total_ammount` on the `po_delivery` table. All the data in the column will be lost.
  - You are about to drop the column `total_ammount` on the `purchase_order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "po_delivery" DROP COLUMN "order_date",
DROP COLUMN "total_ammount";

-- AlterTable
ALTER TABLE "purchase_order" DROP COLUMN "total_ammount",
ADD COLUMN     "sub_total_amount" DOUBLE PRECISION DEFAULT 0;
