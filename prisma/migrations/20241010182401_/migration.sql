/*
  Warnings:

  - The values [IN_PROGESS,FINISHED] on the enum `inspection_request_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "inspection_request_status_new" AS ENUM ('PENDING', 'CANCELLED', 'INSPECTING', 'INSPECTED');
ALTER TABLE "inspection_request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "inspection_request" ALTER COLUMN "status" TYPE "inspection_request_status_new" USING ("status"::text::"inspection_request_status_new");
ALTER TYPE "inspection_request_status" RENAME TO "inspection_request_status_old";
ALTER TYPE "inspection_request_status_new" RENAME TO "inspection_request_status";
DROP TYPE "inspection_request_status_old";
ALTER TABLE "inspection_request" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
