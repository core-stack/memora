import { SourceFragment } from "@/fragment";

import { VectorStore } from "./vector-store.service";

export abstract class SourceVectorStoreService extends VectorStore<SourceFragment> {
}
