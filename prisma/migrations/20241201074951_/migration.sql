-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "started_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "import_receipt" ALTER COLUMN "started_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "inspection_request" ALTER COLUMN "started_at" DROP DEFAULT;
