-- CreateEnum
CREATE TYPE "inspection_request_type" AS ENUM ('MATERIAL', 'PRODUCT');

-- AlterTable
ALTER TABLE "inspection_request" ADD COLUMN     "type" "inspection_request_type" NOT NULL DEFAULT 'MATERIAL';
