import { PipelineContext } from "../context";

import { Edge } from "./edge";

export class SimpleEdge extends Edge {
  constructor(public from: string, public to: string) {
    super();
  }

  async next(context: PipelineContext): Promise<string> {
    return context.state.get(this.to);
  }
}