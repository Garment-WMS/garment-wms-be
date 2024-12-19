/*
  Warnings:

  - A unique constraint covering the columns `[import_receipt_id]` on the table `discussion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[export_receipt_id]` on the table `discussion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "discussion" ADD COLUMN     "export_receipt_id" UUID,
ADD COLUMN     "import_receipt_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "discussion_import_receipt_id_key" ON "discussion"("import_receipt_id");

-- CreateIndex
CREATE UNIQUE INDEX "discussion_export_receipt_id_key" ON "discussion"("export_receipt_id");

-- AddForeignKey
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_import_receipt_id_fkey" FOREIGN KEY ("import_receipt_id") REFERENCES "import_receipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_export_receipt_id_fkey" FOREIGN KEY ("export_receipt_id") REFERENCES "material_export_receipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
