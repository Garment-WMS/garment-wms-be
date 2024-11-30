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
  public static readonly INSPECTING_TO_INSPECTED =
    'status:Inspecting->Inspected';
  public static readonly APPROVED_TO_INSPECTING = 'status:Approved->Inspecting';
  public static readonly INSPECTED_TO_IMPORTING = 'status:Inspected->Importing';

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
