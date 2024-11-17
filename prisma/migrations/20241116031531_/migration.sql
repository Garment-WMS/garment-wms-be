/*
  Warnings:

  - Added the required column `task_id` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "production_plan_detail" ADD COLUMN     "code" VARCHAR;

-- AlterTable
ALTER TABLE "todo" ADD COLUMN     "task_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
