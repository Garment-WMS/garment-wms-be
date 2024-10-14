-- AlterTable
ALTER TABLE "purchase_order" ADD COLUMN     "cancelled_at" TIMESTAMPTZ(6),
ADD COLUMN     "cancelled_reason" VARCHAR;
