export class Constant {
  public static readonly OTP_EXPIRE_MINUTES = 5;
  public static readonly imageMimeTypes =
    /^image\/(jpeg|png|gif|bmp|webp|tiff)$/;

  //Equal to 10 MB (10 * 1024 * 1024 bytes)
  static readonly FILE_SIZE: number = 10 * 1024 * 1024;
}
