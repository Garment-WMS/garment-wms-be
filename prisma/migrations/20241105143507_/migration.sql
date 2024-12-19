-- AlterTable
ALTER TABLE "inventory_report" ADD COLUMN     "from" TIMESTAMPTZ(6),
ADD COLUMN     "to" TIMESTAMPTZ(6),
ALTER COLUMN "note" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inventory_report_plan" ALTER COLUMN "from" DROP NOT NULL,
ALTER COLUMN "to" DROP NOT NULL;
