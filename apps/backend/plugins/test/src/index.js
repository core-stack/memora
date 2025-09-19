export const initialize = async () => {
    return new TestPlugin();
};
export class TestPlugin {
    execute(data) {
        return { data };
    }
    dispose() {
        console.log("dispose");
    }
}
//# sourceMappingURL=index.js.map