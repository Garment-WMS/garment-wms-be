-- CreateTable
CREATE TABLE "production_batch_material_variant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "production_batch_id" UUID NOT NULL,
    "material_variant_id" UUID NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "production_batch_material_variant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "production_batch_material_variant" ADD CONSTRAINT "production_batch_material_variant_production_batch_id_fkey" FOREIGN KEY ("production_batch_id") REFERENCES "production_batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_batch_material_variant" ADD CONSTRAINT "production_batch_material_variant_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
