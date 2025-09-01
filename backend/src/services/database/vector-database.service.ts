import { Injectable, OnModuleInit } from "@nestjs/common";
import { Database } from "arangojs";
import { CollectionType, CreateCollectionOptions, DocumentCollection } from "arangojs/collections";

import { Chunk } from "src/@types";
import { env } from "src/env";

import { SaveOptions, VectorDatabase } from "./types/vector";

@Injectable()
export class VectorDatabaseService implements VectorDatabase, OnModuleInit {
  protected database!: Database;
  protected collection!: DocumentCollection;
  options: CreateCollectionOptions & { type?: CollectionType.DOCUMENT_COLLECTION; } = {
    type: CollectionType.DOCUMENT_COLLECTION,
  };

  constructor() {
    this.database = new Database({
      url: env.ARANGODB_URL,
      databaseName: env.ARANGODB_DATABASE,
      auth: {
        username: env.ARANGODB_USERNAME,
        password: env.ARANGODB_PASSWORD,
      }
    });
  }

  async onModuleInit() {
    await this.ensureCollection(env.ARANGODB_VECTOR_COLLECTION);
  }

  async save(chunk: Chunk | Chunk[], opts?: SaveOptions): Promise<void> {
    chunk = Array.isArray(chunk) ? chunk : [chunk];
    this.collection.saveAll(chunk, { overwriteMode: opts?.upsert ? "update" : "ignore" });
    return;
  }

  private async ensureCollection(
    collectionName: string
  ): Promise<void> {
    const collections = await this.database.collections(true);
    if (!collections.some(c => c.name === collectionName)) {
      this.database.createCollection(collectionName, this.options);
    }
    this.collection = this.database.collection(collectionName);
    await this.collection.ensureIndex({
      type: "persistent",
      fields: ["tenantId"],
    });
  }
}