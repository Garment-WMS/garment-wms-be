-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "expect_finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "started_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;
