import { chat } from "@/db/schema";
import { DrizzleGenericRepository } from "@/generics";
import { Chat } from "@memora/schemas";

export class ChatRepository extends DrizzleGenericRepository<typeof chat, Chat> {
  constructor() {
    super(chat);
  }
}