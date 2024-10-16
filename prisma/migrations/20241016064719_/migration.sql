-- AlterTable
ALTER TABLE "inventory_stock" ALTER COLUMN "material_variant_id" DROP NOT NULL,
ALTER COLUMN "product_variant_id" DROP NOT NULL;
