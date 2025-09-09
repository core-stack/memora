import { VectorStore } from "@langchain/core/vectorstores";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SearchService {
  constructor(private readonly vectorStore: VectorStore) {}

  async semanticSearch(query: string) {

  }

}
