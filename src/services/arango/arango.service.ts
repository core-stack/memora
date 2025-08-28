import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { aql, Database } from "arangojs";

@Injectable()
export class ArangoService implements OnModuleInit, OnModuleDestroy {
  private db: Database;
  private collectionName = "documents";
  private isConnected = false;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>("ARANGO_HOST") || "http://localhost:8529";
    const databaseName = this.configService.get<string>("ARANGO_DATABASE") || "hybrid_search";
    const username = this.configService.get<string>("ARANGO_USERNAME") || "root";
    const password = this.configService.get<string>("ARANGO_PASSWORD") || "";

    this.db = new Database({
      url,
      auth: { username, password },
      databaseName,
    });
  }

  async onModuleInit() {
    try {
      await this.initializeDatabase();
      this.isConnected = true;
      console.log("ArangoDB connected successfully");
    } catch (error) {
      console.error("Failed to connect to ArangoDB:", error);
      throw error;
    }
  }

  async onModuleDestroy() {}

  private async initializeDatabase() {
    const databases = await this.db.listDatabases();
    const dbName = this.configService.getOrThrow<string>("ARANGO_DATABASE");

    if (!databases.includes(dbName)) {
      await this.db.createDatabase(dbName);
    }

    const collections = await this.db.listCollections();
    if (!collections.find((col) => col.name === this.collectionName)) {
      await this.db.createCollection(this.collectionName);

      const collection = this.db.collection(this.collectionName);
      await collection.ensureIndex({
        type: "persistent",
        fields: ["title"],
        name: "idx_title",
      });

      await collection.ensureIndex({
        type: "persistent",
        fields: ["createdAt"],
        name: "idx_created_at",
      });
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.db.query(aql`RETURN 1`);
      return true;
    } catch (error) {
      return false;
    }
  }
}
