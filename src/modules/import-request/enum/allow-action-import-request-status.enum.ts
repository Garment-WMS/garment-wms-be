import { $Enums } from '@prisma/client';

export const allowActionImportRequestStatus = {
  allowCancelStatus: [$Enums.ImportRequestStatus.ARRIVED.toString()],
  allowCreateInspectionRequestStatus: [
    $Enums.ImportRequestStatus.ARRIVED.toString(),
  ],
  allowApproveRejectStatus: [
    $Enums.ImportRequestStatus.ARRIVED.toString(),
    $Enums.ImportRequestStatus.INSPECTED.toString(),
  ],
};
