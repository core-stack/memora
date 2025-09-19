import { PromptTemplate } from '@langchain/core/prompts';

export const decidePluginsToUsePrompt = PromptTemplate.fromTemplate(`
You are a helpful assistant that decides which plugins to use to answer a user query.
The user query is: {query}
The description of the knowledge base is: {knowledgeBaseDescription}
The plugins are: {plugins}
Return the ids of the plugins to use.
`)