/*
  Warnings:

  - The values [CANCELED] on the enum `import_request_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "import_request_status_new" AS ENUM ('ARRIVED', 'CANCELLED', 'REJECTED', 'APPROVED', 'INSPECTING', 'INSPECTED', 'AWAIT_TO_IMPORT', 'IMPORTING', 'IMPORTED');
ALTER TABLE "import_request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "import_request" ALTER COLUMN "status" TYPE "import_request_status_new" USING ("status"::text::"import_request_status_new");
ALTER TYPE "import_request_status" RENAME TO "import_request_status_old";
ALTER TYPE "import_request_status_new" RENAME TO "import_request_status";
DROP TYPE "import_request_status_old";
ALTER TABLE "import_request" ALTER COLUMN "status" SET DEFAULT 'ARRIVED';
COMMIT;
