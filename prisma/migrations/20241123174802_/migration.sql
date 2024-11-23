/*
  Warnings:

  - A unique constraint covering the columns `[import_request_id]` on the table `discussion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[export_request_id]` on the table `discussion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "discussion_import_request_id_key" ON "discussion"("import_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "discussion_export_request_id_key" ON "discussion"("export_request_id");

-- AddForeignKey
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_import_request_id_fkey" FOREIGN KEY ("import_request_id") REFERENCES "import_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_export_request_id_fkey" FOREIGN KEY ("export_request_id") REFERENCES "material_export_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;
