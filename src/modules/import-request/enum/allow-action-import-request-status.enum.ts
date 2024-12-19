import { $Enums } from '@prisma/client';

export const allowActionImportRequestStatus = {
  allowCancelStatus: [$Enums.ImportRequestStatus.ARRIVED.toString()],
  allowCreateInspectionRequestStatus: [
    $Enums.ImportRequestStatus.APPROVED.toString(),
  ],
  allowApproveRejectStatus: [$Enums.ImportRequestStatus.ARRIVED.toString()],
};
