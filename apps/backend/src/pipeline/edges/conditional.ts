import { PipelineContext } from "../context";

import { Edge } from "./edge";

export class ConditionalEdge extends Edge {

  constructor(
    public from: string,
    private condition: (context: PipelineContext) => boolean | Promise<boolean>,
    private t: string,
    private f: string
  ) {
    super();
  }

  async next(context: PipelineContext): Promise<string> {
    return await this.condition(context) ? Promise.resolve(this.t) : Promise.resolve(this.f);
  }
}