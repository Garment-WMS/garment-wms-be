/*
  Warnings:

  - A unique constraint covering the columns `[id,cancelled_by]` on the table `production_batch` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "production_batch_cancelled_by_key";

-- CreateIndex
CREATE UNIQUE INDEX "production_batch_id_cancelled_by_key" ON "production_batch"("id", "cancelled_by");
