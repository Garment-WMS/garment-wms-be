/*
  Warnings:

  - Added the required column `code` to the `inspection_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inspection_request" ADD COLUMN     "code" TEXT NOT NULL;
