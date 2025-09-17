import { PipelineContext } from "../context";

export abstract class Edge {
  abstract from: string;
  abstract next(context: PipelineContext): Promise<string>;
}