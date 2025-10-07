import { PromptTemplate } from '@langchain/core/prompts';

export const improveQueryPrompt = PromptTemplate.fromTemplate(`
You are a helpful assistant that improves a user query to be more details in the context of a knowledge base.
Return only the improved query.
The user query is in a knowledge base with many sources.
The instructions of the knowledge base is: {knowledgeInstructions}
The user query is: {query}
`)