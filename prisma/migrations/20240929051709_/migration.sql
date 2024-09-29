/*
  Warnings:

  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "purchase_order" DROP CONSTRAINT "purchase_order_supplier_id_fkey";

-- DropTable
DROP TABLE "Supplier";

-- CreateTable
CREATE TABLE "supplier" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "supplier_name" VARCHAR,
    "supplier_code" VARCHAR,
    "address" VARCHAR,
    "representative_name" VARCHAR,
    "email" VARCHAR,
    "phone_number" VARCHAR,
    "fax" VARCHAR,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "supplier_supplier_code_key" ON "supplier"("supplier_code");

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
