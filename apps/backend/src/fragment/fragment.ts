import { randomUUID } from 'crypto';

import { BaseFragment as FragmentType, baseFragmentSchema } from '@memora/schemas';

export interface IFragment extends FragmentType {};

export abstract class BaseFragment implements IFragment {
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
    this.createdAt = f.createdAt || new Date();
    this.updatedAt = f.updatedAt || new Date();
    this.metadata = f.metadata;
    baseFragmentSchema.parse(this);
  }
}