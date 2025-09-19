import type { Initializer, IPlugin } from "memora-plugin";

export const initialize: Initializer = async () => {
  return new TestPlugin();
}

export class TestPlugin implements IPlugin {
  execute(data: any) {
    return { data };
  }

  dispose?(): Promise<void> | void {
    console.log("dispose");
  }
}