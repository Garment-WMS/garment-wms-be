/*
  Warnings:

  - You are about to drop the column `canceled_at` on the `production_batch` table. All the data in the column will be lost.
  - You are about to drop the column `canceled_by` on the `production_batch` table. All the data in the column will be lost.
  - You are about to drop the column `canceled_reason` on the `production_batch` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cancelled_by]` on the table `production_batch` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "production_batch" DROP COLUMN "canceled_at",
DROP COLUMN "canceled_by",
DROP COLUMN "canceled_reason",
ADD COLUMN     "cancelled_at" TIMESTAMPTZ(6),
ADD COLUMN     "cancelled_by" UUID,
ADD COLUMN     "cancelled_reason" VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "production_batch_cancelled_by_key" ON "production_batch"("cancelled_by");

-- AddForeignKey
ALTER TABLE "production_batch" ADD CONSTRAINT "production_batch_cancelled_by_fkey" FOREIGN KEY ("cancelled_by") REFERENCES "production_department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
