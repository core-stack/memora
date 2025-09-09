import { Chunks } from '@/generics/chunk';

export interface IProcessor {
  process(tenantId: string, input: string | Blob): Promise<Chunks>
}