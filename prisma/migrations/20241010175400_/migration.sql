/*
  Warnings:

  - You are about to drop the column `delivery_note_id` on the `inspection_request` table. All the data in the column will be lost.
  - You are about to drop the column `notation` on the `inspection_request` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inspection_request_id]` on the table `inspection_report` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inspection_department_id]` on the table `inspection_report` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inspection_request_id` to the `inspection_report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `import_request_id` to the `inspection_request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReceiptType" AS ENUM ('MATERIAL', 'PRODUCT');

-- AlterTable
ALTER TABLE "import_receipt" ADD COLUMN     "code" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "type" "ReceiptType",
ADD COLUMN     "warehouse_manager_id" UUID;

-- AlterTable
ALTER TABLE "inspection_report" ADD COLUMN     "inspection_request_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "inspection_request" DROP COLUMN "delivery_note_id",
DROP COLUMN "notation",
ADD COLUMN     "import_request_id" UUID NOT NULL,
ADD COLUMN     "note" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "inspection_report_inspection_request_id_key" ON "inspection_report"("inspection_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "inspection_report_inspection_department_id_key" ON "inspection_report"("inspection_department_id");

-- AddForeignKey
ALTER TABLE "import_receipt" ADD CONSTRAINT "import_receipt_warehouse_manager_id_fkey" FOREIGN KEY ("warehouse_manager_id") REFERENCES "warehouse_manager"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report" ADD CONSTRAINT "inspection_report_inspection_request_id_fkey" FOREIGN KEY ("inspection_request_id") REFERENCES "inspection_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_request" ADD CONSTRAINT "inspection_request_import_request_id_fkey" FOREIGN KEY ("import_request_id") REFERENCES "import_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
