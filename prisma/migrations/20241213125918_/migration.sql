-- CreateEnum
CREATE TYPE "ReOrderAlertStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "re_order_alert" (
    "id" SERIAL NOT NULL,
    "material_variant_id" UUID NOT NULL,
    "current_quantity_by_uom" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reorder_quantity_by_uom" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "ReOrderAlertStatus" NOT NULL DEFAULT 'OPEN',
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "re_order_alert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "re_order_alert" ADD CONSTRAINT "re_order_alert_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
