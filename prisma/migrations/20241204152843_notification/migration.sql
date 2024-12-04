-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('IMPORT_REQUEST', 'IMPORT_RECEIPT', 'MATERIAL_EXPORT_REQUEST', 'MATERIAL_EXPORT_RECEIPT', 'INVENTORY_REPORT', 'ANY');

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "account_id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "message" VARCHAR NOT NULL,
    "path" VARCHAR NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'ANY',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
