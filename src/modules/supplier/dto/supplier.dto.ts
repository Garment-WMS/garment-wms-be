import { Supplier } from '@prisma/client';

export class SupplierDto implements Supplier {
  id: string;
  supplierName: string;
  code: string;
  address: string;
  representativeName: string;
  email: string;
  phoneNumber: string;
  fax: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
