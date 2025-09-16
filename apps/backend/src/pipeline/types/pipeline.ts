import { Edge } from "../edges/edge";
import { Step, StepType } from "../steps/step";

import { PipelineContext } from "./context";

export class Pipeline {
  constructor(private steps: Map<string, Step>, private edges: Edge[]) {}

  async run(knowledgeId: string, input: string): Promise<string> {
    const initialStep = this.steps.get(StepType.START);
    if (!initialStep) throw new Error("No start step found");

    const lastStep = this.steps.get(StepType.END);
    if (!lastStep) throw new Error("No last step found");

    let currentStep = initialStep;
    let currentStepName: string = StepType.START;
    let context = { input, knowledgeId, state: new Map() } as PipelineContext;

    while(currentStepName !== StepType.END) {
      context = await currentStep.run(context);
      const nextStepName = await this.edges.find(e => e.from === currentStepName)?.next(context);
      if (!nextStepName) throw new Error("No next step found");
      if (!this.steps.has(nextStepName)) throw new Error(`Step ${nextStepName} not found`);
      currentStep = this.steps.get(nextStepName)!;
      currentStepName = nextStepName;
    }

    return Promise.resolve(input);
  }
}
