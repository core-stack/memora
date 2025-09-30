import { message } from "@/db/schema";
import { DrizzleGenericRepository } from "@/generics";
import { Message } from "@memora/schemas";

export class MessageRepository extends DrizzleGenericRepository<typeof message, Message> {
  constructor() {
    super(message);
  }
}