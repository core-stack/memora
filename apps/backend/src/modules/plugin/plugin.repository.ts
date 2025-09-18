import { plugin } from "@/db/schema";
import { DrizzleGenericRepository } from "@/generics";
import { Plugin } from "@memora/schemas";

export class PluginRepository extends DrizzleGenericRepository<typeof plugin, Plugin> {
  constructor() {
    super(plugin);
  }
}