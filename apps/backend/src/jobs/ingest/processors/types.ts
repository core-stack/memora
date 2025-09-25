import { Fragments } from "@/fragment";
import { Source } from "@memora/schemas";

export interface IProcessor {
  process(source: Source, input: any): Promise<Fragments>
}