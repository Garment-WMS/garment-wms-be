import { supplier } from '@prisma/client';
import { UUID } from 'crypto';

export class SupplierDto implements supplier {
  id: UUID;
  supplier_name: string;
  supplier_code: string;
  address: string;
  representative_name: string;
  email: string;
  phone_number: string;
  fax: string;
  create_at: Date;
  update_at: Date;
  deleted_at: Date;
}
