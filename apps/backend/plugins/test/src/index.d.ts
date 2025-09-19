import type { Initializer, IPlugin } from "memora-plugin";
export declare const initialize: Initializer;
export declare class TestPlugin implements IPlugin {
    execute(data: any): {
        data: any;
    };
    dispose?(): Promise<void> | void;
}
//# sourceMappingURL=index.d.ts.map