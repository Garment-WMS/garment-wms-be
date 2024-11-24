-- CreateTable
CREATE TABLE "defect" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR,
    "description" VARCHAR,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "defect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_report_detail_defect" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "inspection_report_id" UUID NOT NULL,
    "defect_id" UUID NOT NULL,
    "description" VARCHAR,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "inspection_report_detail_defect_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inspection_report_detail_defect" ADD CONSTRAINT "inspection_report_detail_defect_inspection_report_id_fkey" FOREIGN KEY ("inspection_report_id") REFERENCES "inspection_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report_detail_defect" ADD CONSTRAINT "inspection_report_detail_defect_defect_id_fkey" FOREIGN KEY ("defect_id") REFERENCES "defect"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
