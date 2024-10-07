export class DataResponse {
  public data: any;
  public pageMeta: {
    offset: number;
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };

  constructor(data: any, pageMeta: any) {
    this.data = data;
    this.pageMeta = pageMeta;
  }
}
