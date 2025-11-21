import { SearchResults } from "@zilliz/milvus2-sdk-node";

export class VectorSearchError extends Error {
  constructor(message?: string, searchResult?: SearchResults<any>) {
    super(message, { cause: searchResult });
    this.name = "VectorSearchError";
    Object.setPrototypeOf(this, VectorSearchError.prototype);
  }
}
