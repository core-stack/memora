import { PipelineContext } from "../types/context";

export enum StepType {
  START = "START",
  END = "END"
}

export abstract class Step {
  abstract run(context: PipelineContext): Promise<PipelineContext> | PipelineContext;
}