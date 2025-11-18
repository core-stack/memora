import { randomUUID } from 'crypto';
import moment from 'moment';

export abstract class BaseFragment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  metadata: any;

  constructor(
    f: Omit<BaseFragment, "id" | "createdAt" | "updatedAt"> & { id?: string, createdAt?: Date, updatedAt?: Date }
  ) {
    this.content = f.content;
    this.id = f.id || randomUUID();
    this.createdAt = moment(f.createdAt).toDate();
    this.updatedAt = moment(f.updatedAt).toDate();
    this.metadata = f.metadata;
  }
}