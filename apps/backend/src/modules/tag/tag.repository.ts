import { tag } from "@/db/schema";
import { DrizzleGenericRepository } from "@/generics";
import { Tag } from "@memora/schemas";

export class TagRepository extends DrizzleGenericRepository<typeof tag, Tag> {
  constructor() {
    super(tag);
  }
}