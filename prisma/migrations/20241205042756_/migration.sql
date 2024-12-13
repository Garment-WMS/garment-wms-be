-- AlterTable
ALTER TABLE "inventory_report_plan" ADD COLUMN     "canceled_by" VARCHAR,
ADD COLUMN     "cancelledAt" TIMESTAMPTZ(6),
ADD COLUMN     "cancelled_reason" VARCHAR,
ADD COLUMN     "finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "started_at" TIMESTAMPTZ(6);
