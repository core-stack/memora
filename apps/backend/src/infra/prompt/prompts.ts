// Generated file - do not edit
import { PromptTemplate } from './prompt-template';


export interface AnwserQuestionVars {
  question: string;
  recentMessages: {
    role: string;
    content: string;
  }[];
  relevantMessages: {
    content: string;
    role: string;
  }[];
  retrievedFragments: string[];
}

export const AnwserQuestion = new PromptTemplate<AnwserQuestionVars>(
  "\nYou are a helpful and knowledgeable assistant.\n\nBelow are details you should use to answer the user's question:\n\n\n**User Question:**\n{{question}}\n\n{{#if (gt recentMessages.length 0)}}\n**Recent Conversation (up to 20 messages):**\n{{#each recentMessages}}\n- {{this.role}}: {{this.content}}\n{{/each}}\n{{/if}}\n\n{{#if (gt relevantMessages.length 0)}}\n**Relevant Messages Retrieved from the Knowledge Base:**\n{{#each relevantMessages}}\n- {{this.role}}: {{this.content}}\n{{/each}}\n{{/if}}\n\n\n{{#if (gt retrievedFragments.length 0)}}\n**Relevant Contents Retrieved from the Knowledge Base:**\n{{#each retrievedFragments}}\n- {{this}}\n{{/each}}\n{{/if}}\n\n**Instructions:**\n1. Always respond in the **same language** the question was asked.\n2. Use the provided messages as context to build an accurate and helpful answer.\n3. **Do not make up information** — if the answer is unclear or unavailable, say that you don't have enough information.\n4. Be clear, concise, and natural in your tone.\n"
);

export interface DecidePluginsToUseVars {
  query: string;
  knowledgeInstructions?: string;
  plugins: any[];
}

export const DecidePluginsToUse = new PromptTemplate<DecidePluginsToUseVars>(
  "\nYou are a helpful assistant that decides which plugins to use to answer a user query.\nThe user query is: {{query}}\nThe instructions of the knowledge base is: {{knowledgeInstructions}}\n{{#each plugins}}\n  - Plugin name: {{this.name}}\n  {{#if this.decription}}\n  - Plugin description: {{this.description}}\n  {{/if}}\n  {{#if this.whenUse}}\n  - When to use this plugin: {{this.whenUse}}\n  {{/if}}\n{{/each}}\nThe plugins are: {{plugins}}\nReturn the ids of the plugins to use."
);

export interface GenerateChatNameVars {
  query: string;
}

export const GenerateChatName = new PromptTemplate<GenerateChatNameVars>(
  "You are an assistant that generates short, descriptive chat titles based on the user’s first message.\n\nInstructions:\n- First, detect the language of the user’s initial message.\n- Then, generate the title in that same language.\n- The title should be short (2–6 words), clear, and accurately reflect what the chat is about.\n- Avoid generic terms like “conversation” or “chat.”\n- Capitalize titles appropriately for the detected language (e.g., English title case, Portuguese sentence case).\n\nExamples:\n- Input: “How can I improve my sleep schedule?” → Output: “Better Sleep Habits”\n- Input: “Como configurar um servidor NestJS?” → Output: “Configuração do servidor NestJS”\n- Input: “Ideas for a minimalistic tattoo” → Output: “Minimalist Tattoo Ideas”\n- Input: “Explica a diferença entre machine learning e deep learning” → Output: “Diferença entre machine learning e deep learning”\n\nYour task:\nGiven the user’s first message, output only the final chat title in the detected language.\nThe user message is: {{query}}"
);

export interface ImproveQueryVars {
  query: string;
  knowledgeInstructions?: string;
}

export const ImproveQuery = new PromptTemplate<ImproveQueryVars>(
  "You are a helpful assistant that improves a user query to be more details in the context of a knowledge base.\nReturn only the improved query.\nThe user query is in a knowledge base with many sources.\n{{#if knowledgeInstructions}}\nThe instructions of the knowledge base is: {{knowledgeInstructions}}\n{{/if}}\nThe user query is: {{query}}"
);

export interface RunQueryVars {

}

export const RunQuery = new PromptTemplate<RunQueryVars>(
  ""
);


export const PromptTemplates = { AnwserQuestion, DecidePluginsToUse, GenerateChatName, ImproveQuery, RunQuery } as const;
