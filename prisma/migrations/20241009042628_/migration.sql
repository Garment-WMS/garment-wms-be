/*
  Warnings:

  - The values [IN_PROGESS] on the enum `purchase_order_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [RENTER,LANDLORD,STAFF,TECHNICAL_STAFF,MANAGER] on the enum `role_codes` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `factory_director` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `inspection_department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `production_department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `purchasing_staff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `warehouse_manager` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `warehouse_staff` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "purchase_order_status_new" AS ENUM ('IN_PROGRESS', 'CANCELLED', 'FINISHED');
ALTER TABLE "purchase_order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "purchase_order" ALTER COLUMN "status" TYPE "purchase_order_status_new" USING ("status"::text::"purchase_order_status_new");
ALTER TYPE "purchase_order_status" RENAME TO "purchase_order_status_old";
ALTER TYPE "purchase_order_status_new" RENAME TO "purchase_order_status";
DROP TYPE "purchase_order_status_old";
ALTER TABLE "purchase_order" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "role_codes_new" AS ENUM ('ADMIN', 'WAREHOUSE_STAFF', 'WAREHOUSE_MANAGER', 'FACTORY_DIRECTOR', 'INSPECTION_DEPARTMENT', 'PRODUCTION_DEPARTMENT', 'PURCHASING_STAFF');
ALTER TABLE "temp" ALTER COLUMN "role" TYPE "role_codes_new" USING ("role"::text::"role_codes_new");
ALTER TYPE "role_codes" RENAME TO "role_codes_old";
ALTER TYPE "role_codes_new" RENAME TO "role_codes";
DROP TYPE "role_codes_old";
COMMIT;

-- AlterTable
ALTER TABLE "purchase_order" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';

-- CreateIndex
CREATE UNIQUE INDEX "factory_director_user_id_key" ON "factory_director"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "inspection_department_user_id_key" ON "inspection_department"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "production_department_user_id_key" ON "production_department"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchasing_staff_user_id_key" ON "purchasing_staff"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_manager_user_id_key" ON "warehouse_manager"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_staff_user_id_key" ON "warehouse_staff"("user_id");
