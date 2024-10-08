import { Supplier } from '@prisma/client';

export class SupplierDto implements Supplier {
  id: string;
  supplierName: string;
  supplierCode: string;
  address: string;
  representativeName: string;
  email: string;
  phoneNumber: string;
  fax: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
