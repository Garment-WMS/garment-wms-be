/*
  Warnings:

  - The primary key for the `re_order_alert` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `re_order_alert` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "re_order_alert" DROP CONSTRAINT "re_order_alert_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "re_order_alert_pkey" PRIMARY KEY ("id");
