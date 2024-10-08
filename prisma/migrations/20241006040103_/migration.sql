/*
  Warnings:

  - You are about to drop the column `demand_quantity` on the `quarterly_production_detail` table. All the data in the column will be lost.
  - You are about to drop the column `notation` on the `quarterly_production_detail` table. All the data in the column will be lost.
  - You are about to drop the column `reserve_percent_id` on the `quarterly_production_detail` table. All the data in the column will be lost.
  - You are about to drop the column `starting_quantity` on the `quarterly_production_detail` table. All the data in the column will be lost.
  - Added the required column `name` to the `annual_production_plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "annual_production_plan" ADD COLUMN     "name" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "quarterly_production_detail" DROP COLUMN "demand_quantity",
DROP COLUMN "notation",
DROP COLUMN "reserve_percent_id",
DROP COLUMN "starting_quantity",
ADD COLUMN     "map" VARCHAR;
