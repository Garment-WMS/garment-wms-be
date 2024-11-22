/*
  Warnings:

  - You are about to drop the column `quantity_to_produce` on the `production_batch` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[production_plan_detail_id]` on the table `production_batch` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "production_batch" DROP COLUMN "quantity_to_produce";

-- CreateIndex
CREATE UNIQUE INDEX "production_batch_production_plan_detail_id_key" ON "production_batch"("production_plan_detail_id");
