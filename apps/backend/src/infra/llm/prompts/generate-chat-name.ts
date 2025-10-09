import { PromptTemplate } from "@langchain/core/prompts";

export const generateChatNamePrompt = PromptTemplate.fromTemplate(`
You are a helpful assistant that generates a name for a chat.
The user query is: {query}
Return only the generated name.
  `)