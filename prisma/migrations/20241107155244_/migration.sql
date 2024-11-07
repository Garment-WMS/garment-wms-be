/*
  Warnings:

  - You are about to drop the column `warehouse_manager_id` on the `receipt_adjustment` table. All the data in the column will be lost.
  - Added the required column `adjustment_at` to the `receipt_adjustment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "receipt_adjustment" DROP CONSTRAINT "receipt_adjustment_warehouse_manager_id_fkey";

-- AlterTable
ALTER TABLE "receipt_adjustment" DROP COLUMN "warehouse_manager_id",
ADD COLUMN     "adjustment_at" TIMESTAMPTZ(6) NOT NULL;
