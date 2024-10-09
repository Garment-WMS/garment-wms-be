/*
  Warnings:

  - Made the column `purchase_order_id` on table `po_delivery` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "po_delivery" ALTER COLUMN "purchase_order_id" SET NOT NULL;
