import { decidePluginsToUsePrompt } from "./decide-plugin-to-use";
import { generateChatNamePrompt } from "./generate-chat-name";
import { improveQueryPrompt } from "./improve-query";

export enum Prompt {
  DECIDE_PLUGINS_TO_USE = 'decide-plugins-to-use',
  IMPROVE_QUERY = 'improve-query',
  GENERATE_CHAT_NAME = 'generate-chat-name',
}

export const prompts = {
  [Prompt.DECIDE_PLUGINS_TO_USE]: decidePluginsToUsePrompt,
  [Prompt.IMPROVE_QUERY]: improveQueryPrompt,
  [Prompt.GENERATE_CHAT_NAME]: generateChatNamePrompt,
} as const