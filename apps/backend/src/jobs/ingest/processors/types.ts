import { Chunks } from "@/generics/chunk";
import { Source } from "@memora/schemas";

export interface IProcessor {
  process(source: Source, input: any): Promise<Chunks>
}