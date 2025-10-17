import { Fragments, SourceFragment } from '@/fragment';
import { Source } from '@snipet/schemas';

export interface IProcessor {
  process(source: Source, input: any): Promise<Fragments<SourceFragment>>
}