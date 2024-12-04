export class Constant {
  public static readonly OTP_EXPIRE_MINUTES = 5;
  public static readonly imageMimeTypes =
    /^image\/(jpeg|png|gif|bmp|webp|tiff)$/;

  //Equal to 10 MB (10 * 1024 * 1024 bytes)
  static readonly FILE_SIZE: number = 10 * 1024 * 1024;

  public static readonly DEFAULT_OFFSET = 0;
  public static readonly DEFAULT_LIMIT = 100;
  public static readonly PO_CODE_PREFIX = 'PO';
  public static readonly POD_CODE_PREFIX = 'PO-DEL';
  public static readonly IMPORT_REQUEST_INSPECTING_TO_INSPECTED =
    'status:Inspecting->Inspected';
  public static readonly IMPORT_RECEIPT_INSPECTED_TO_AWAIT_TO_IMPORT =
    'status:Inspected->Await to import';
  public static readonly AWAIT_TO_IMPORT_TO_IMPORTING =
    'status:Await to import->Importing';
  public static readonly EXPORT_RECEIPT_AWAIT_TO_EXPORT_TO_EXPORTING =
    'status:Await to export->Exporting';
  public static readonly APPROVED_TO_INSPECTING = 'status:Approved->Inspecting';
  public static readonly ARRIVED_TO_APPROVED = 'status:Arrived->Approved';
  public static readonly ARRIVED_TO_CANCELED = 'status:Arrived->Cancelled';
  public static readonly INSPECTED_TO_IMPORTING = 'status:Inspected->Importing';
  public static readonly IMPORTING_TO_IMPORTED: string =
    'status:Importing->Imported';
  static readonly EXPORT_RECEIPT_AWAIT_TO_EXPORT_TO_EXPORTED: string =
    'status:Exporting->Exported';
  public static readonly AWAIT_TO_EXPORT_TO_EXPORTING: string =
    'status:Await to Export->Exporting';
  static AWAIT_TO_EXPORT_TO_REJECT: string = 'status:Await to Export->Rejected';
  static PENDING_TO_APPROVE: string = 'status:Pending->Approved';
  static PENDING_TO_REJECT: string = 'status:Pending->Rejected';
  static EXPORT_REQUEST_EXPORTED_PRODUCTION_APPROVED: string =
    'status:Exported->Production Approved';
  static EXPORT_REQUEST_EXPORTED_PRODUCTION_REJECTED: string =
    'status:Exported->Production Rejected';

  public static readonly months = [
    { 1: 'January' },
    { 2: 'February' },
    { 3: 'March' },
    { 4: 'April' },
    { 5: 'May' },
    { 6: 'June' },
    { 7: 'July' },
    { 8: 'August' },
    { 9: 'September' },
    { 10: 'October' },
    { 11: 'November' },
    { 12: 'December' },
  ];
}

export type months = [
  { 1: 'January' },
  { 2: 'February' },
  { 3: 'March' },
  { 4: 'April' },
  { 5: 'May' },
  { 6: 'June' },
  { 7: 'July' },
  { 8: 'August' },
  { 9: 'September' },
  { 10: 'October' },
  { 11: 'November' },
  { 12: 'December' },
];
