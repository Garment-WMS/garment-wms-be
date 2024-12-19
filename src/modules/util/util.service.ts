import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UtilService {
  async update() {
    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "chat"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months'
    // `);
    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "Task"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months',
    //     "expected_started_at" = "expected_started_at" - INTERVAL '6 months',
    //     "expect_finished_at" = "expect_finished_at" - INTERVAL '6 months',
    //     "started_at" = "started_at" - INTERVAL '6 months',
    //     "finished_at" = "finished_at" - INTERVAL '6 months'
    // `);
    // await this.prismaService.$executeRawUnsafe(`
    //     UPDATE "discussion"
    //     SET
    //       "created_at" = "created_at" - INTERVAL '6 months',
    //       "updated_at" = "updated_at" - INTERVAL '6 months'
    //    `);
    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "import_receipt"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months',
    //     "finished_at" = "finished_at" - INTERVAL '6 months',
    //     "started_at" = "started_at" - INTERVAL '6 months'
    //  `);
    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "import_request"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months',
    //     "finished_at" = "finished_at" - INTERVAL '6 months',
    //     "started_at" = "started_at" - INTERVAL '6 months',
    //     "import_expected_finished_at" = "import_expected_finished_at" - INTERVAL '6 months',
    //     "import_expected_started_at" = "import_expected_started_at" - INTERVAL '6 months',
    //     "inspect_expected_finished_at" = "inspect_expected_finished_at" - INTERVAL '6 months',
    //     "inspect_expected_started_at" = "inspect_expected_started_at" - INTERVAL '6 months'
    //  `);
    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "import_request_detail"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months'
    //  `);
    //  await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "inspection_report"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months',
    //     "finished_at" = "finished_at" - INTERVAL '6 months'
    //  `);
    // await this.prismaService.$executeRawUnsafe(`
    //     UPDATE "inspection_report_detail"
    //     SET
    //       "created_at" = "created_at" - INTERVAL '6 months',
    //       "updated_at" = "updated_at" - INTERVAL '6 months'
    //    `);
    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "inspection_report_detail_defect"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months'
    //  `);
    // await this.prismaService.$executeRawUnsafe(`
    //     UPDATE "inspection_request"
    //     SET
    //       "created_at" = "created_at" - INTERVAL '6 months',
    //       "updated_at" = "updated_at" - INTERVAL '6 months',
    //       "finished_at" = "finished_at" - INTERVAL '6 months',
    //       "started_at" = "started_at" - INTERVAL '6 months',
    //       "expected_finished_at" = "expected_finished_at" - INTERVAL '6 months',
    //       "expected_started_at" = "expected_started_at" - INTERVAL '6 months'
    //    `);
    // await this.prismaService.$executeRawUnsafe(`
    //     UPDATE "inventory_report"
    //     SET
    //       "created_at" = "created_at" - INTERVAL '6 months',
    //       "updated_at" = "updated_at" - INTERVAL '6 months',
    // "from" = "from" - INTERVAL '6 months',
    // "to" = "to" - INTERVAL '6 months'
    //    `);
    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "inventory_report_detail"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months',
    //     "recored_at" = "recored_at" - INTERVAL '6 months'
    //  `);
    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "inventory_report_plan"
    //   SET
    //     "createdAt" = "createdAt" - INTERVAL '6 months',
    //     "updatedAt" = "updatedAt" - INTERVAL '6 months',
    //     "cancelledAt" = "cancelledAt" - INTERVAL '6 months',
    //     "from" = "from" - INTERVAL '6 months',
    //     "to" = "to" - INTERVAL '6 months',
    //     "finished_at" = "finished_at" - INTERVAL '6 months',
    //     "started_at" = "started_at" - INTERVAL '6 months'
    //  `);
    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "inventory_report_plan_detail"
    //   SET
    //     "createdAt" = "createdAt" - INTERVAL '6 months',
    //     "updatedAt" = "updatedAt" - INTERVAL '6 months'
    //  `);

    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "inventory_stock"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months'
    //  `);

    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "material_export_receipt"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months',
    //     "expected_finished_at" = "expected_finished_at" - INTERVAL '6 months',
    //     "expected_started_at" = "expected_started_at" - INTERVAL '6 months',
    //     "finished_at" = "finished_at" - INTERVAL '6 months',
    //     "started_at" = "started_at" - INTERVAL '6 months'
    //  `);

    // await this.prismaService.$executeRawUnsafe(`
    //     UPDATE "material_export_receipt_detail"
    //     SET
    //       "created_at" = "created_at" - INTERVAL '6 months',
    //       "updated_at" = "updated_at" - INTERVAL '6 months'
    //    `);

    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "material_export_request"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months',
    //     "production_reject_at" = "production_reject_at" - INTERVAL '6 months',
    //     "export_expected_date_time" = "export_expected_date_time" - INTERVAL '6 months'
    //  `);

    //   await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "material_export_request_detail"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months'
    //  `);

    //    await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "material_receipt"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months',
    //     "import_date" = "import_date" - INTERVAL '6 months'
    //  `);

    // await this.prismaService.$executeRawUnsafe(`
    //       UPDATE "po_delivery"
    //       SET
    //         "created_at" = "created_at" - INTERVAL '6 months',
    //         "updated_at" = "updated_at" - INTERVAL '6 months',
    //         "expected_deliver_date" = "expected_deliver_date" - INTERVAL '6 months',
    //         "deliver_date" = "deliver_date" - INTERVAL '6 months',
    //         "cancelled_at" = "cancelled_at" - INTERVAL '6 months'
    //      `);

    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "po_delivery_detail"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months'
    //  `);

    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "product_receipt"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months',
    //     "import_date" = "import_date" - INTERVAL '6 months'
    //  `);

    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "production_batch"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months',
    //     "start_date" = "start_date" - INTERVAL '6 months',
    //     "finished_date" = "finished_date" - INTERVAL '6 months',
    //     "cancelled_at" = "cancelled_at" - INTERVAL '6 months',
    //     "expected_finish_date" = "expected_finish_date" - INTERVAL '6 months',
    //     "expected_start_date" = "expected_start_date" - INTERVAL '6 months'
    //     `);

    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "production_plan"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months',
    //     "start_date" = "start_date" - INTERVAL '6 months',
    //     "finish_date" = "finish_date" - INTERVAL '6 months',
    //     "expected_start_date" = "expected_start_date" - INTERVAL '6 months',
    //     "expected_end_date" = "expected_end_date" - INTERVAL '6 months'
    //     `);

    // await this.prismaService.$executeRawUnsafe(`
    //   UPDATE "production_plan_detail"
    //   SET
    //     "created_at" = "created_at" - INTERVAL '6 months',
    //     "updated_at" = "updated_at" - INTERVAL '6 months'
    //     `);

    // await this.prismaService.$executeRawUnsafe(`
    //       UPDATE "purchase_order"
    //       SET
    //         "created_at" = "created_at" - INTERVAL '6 months',
    //         "updated_at" = "updated_at" - INTERVAL '6 months',
    //         "order_date" = "order_date" - INTERVAL '6 months',
    //         "expected_finish_date" = "expected_finish_date" - INTERVAL '6 months',
    //         "finish_date" = "finish_date" - INTERVAL '6 months',
    //         "cancelled_at" = "cancelled_at" - INTERVAL '6 months'
    //         `);

      // await this.prismaService.$executeRawUnsafe(`
      //     UPDATE "receipt_adjustment"
      //     SET
      //       "created_at" = "created_at" - INTERVAL '6 months',
      //       "updated_at" = "updated_at" - INTERVAL '6 months'
      //       `);

      // await this.prismaService.$executeRawUnsafe(`
      //   UPDATE "receipt_adjustment"
      //   SET
      //     "created_at" = "created_at" - INTERVAL '6 months',
      //     "updated_at" = "updated_at" - INTERVAL '6 months'
      //     `);
  }
  constructor(private readonly prismaService: PrismaService) {}
  regenerateCode(tableWithCode: Prisma.ModelName) {}
}
