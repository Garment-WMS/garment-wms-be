/*
  Warnings:

  - You are about to drop the `re_order_alert` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "re_order_alert" DROP CONSTRAINT "re_order_alert_material_variant_id_fkey";

-- DropTable
DROP TABLE "re_order_alert";

-- CreateTable
CREATE TABLE "reorder_alert" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_variant_id" UUID NOT NULL,
    "current_quantity_by_uom" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reorder_quantity_by_uom" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "ReOrderAlertStatus" NOT NULL DEFAULT 'OPEN',
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "reorder_alert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reorder_alert" ADD CONSTRAINT "reorder_alert_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
