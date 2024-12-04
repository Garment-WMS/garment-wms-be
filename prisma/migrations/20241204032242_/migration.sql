/*
  Warnings:

  - The values [WAITING_FOR_EXPORTING_MATERIAL] on the enum `production_batch_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "production_batch_status_new" AS ENUM ('PENDING', 'EXECUTING', 'MANUFACTURING', 'IMPORTING', 'FINISHED', 'CANCELED');
ALTER TABLE "production_batch" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "production_batch" ALTER COLUMN "status" TYPE "production_batch_status_new" USING ("status"::text::"production_batch_status_new");
ALTER TYPE "production_batch_status" RENAME TO "production_batch_status_old";
ALTER TYPE "production_batch_status_new" RENAME TO "production_batch_status";
DROP TYPE "production_batch_status_old";
ALTER TABLE "production_batch" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
