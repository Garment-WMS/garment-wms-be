export class CustomAuthException {
  status: number;
  message: string;
  errors: any;
  stack: any;
  constructor(status: number, message: string, error: any, stack?: any) {}

  getStatus() {
    return this.status;
  }
}
