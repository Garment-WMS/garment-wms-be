-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_sender_id_fkey";

-- AlterTable
ALTER TABLE "chat" ADD COLUMN     "is_system" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "sender_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
