export type FindOptions = {
  knowledgeId: string;
  userInput: string;
  chatId?: string;
  metadata?: Record<string, any>;
  forceUsePlugins?: string[]; // list of plugin ids
  excludePlugins?: string[]; // list of plugin ids
}

export type Finder = (...args: any[]) => Partial<FindOptions>;

export const withOptions: Finder = (options: Partial<FindOptions>) => {
  return options;
}
export const withMetadata: Finder = (metadata: Record<string, any>) => {
  return { metadata };
}
export const withChatId: Finder = (chatId: string) => {
  return { chatId };
}
export const withExcludePlugins: Finder = (plugins: string[]) => {
  return { excludePlugins: plugins };
}
export const withForceUsePlugins: Finder = (plugins: string[]) => {
  return { forceUsePlugins: plugins };
}