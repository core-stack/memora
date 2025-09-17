import { Edge } from "../edges/edge";
import { Step } from "../steps/step";

import { Pipeline } from "./pipeline";

export class PipelineBuilder {
  private steps: Map<string, Step> = new Map();
  private edges: Edge[] = [];

  addStep(name: string, step: Step): this {
    this.steps.set(name, step);
    return this;
  }

  addEdge(edge: Edge): this {
    this.edges.push(edge);
    return this;
  }

  build(): Pipeline {
    return new Pipeline(this.steps, this.edges);
  }
}