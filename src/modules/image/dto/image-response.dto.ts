export interface ImageResponse {
  successful: Array<{
    fileName: string;
    displayName: string;
    index: number;
  }>;
  failed: Array<{
    fileName: string;
    index: number;
    error: any;
  }>;
}
