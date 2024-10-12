import { PageMeta } from './page-meta';

export class DataResponse {
  public data: any;
  public pageMeta: PageMeta;
  public statistics?: any;

  constructor(data: any, pageMeta: any, statistics?: any) {
    this.data = data;
    this.pageMeta = pageMeta;
    this.statistics = statistics;
  }
}
