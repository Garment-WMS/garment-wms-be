-- CreateTable
CREATE TABLE "chat" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "discussion_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "import_request_id" UUID,
    "export_request_id" UUID,
    "inventory_report_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "discussion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "discussion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
