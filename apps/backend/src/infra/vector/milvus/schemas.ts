import { env } from '@/env';
import { DataType, FieldType } from '@zilliz/milvus2-sdk-node';

export const schema: FieldType[] = [
  {
    name: "id",
    data_type: DataType.VarChar,
    max_length: 36,
    is_primary_key: true,
  },
  {
    name: "seqId",
    data_type: DataType.Int32
  },
  {
    name: "embedding",
    data_type: DataType.FloatVector,
    dim: env.EMBEDDING_DIMENSION
  },
  {
    name: "content",
    data_type: DataType.VarChar,
    max_length: 2048,
    enable_analyzer: true,
    enable_match: true,
    analyzer_params: {
      "tokenizer": "standard",
      "filter": ["asciifolding"],
    }
  },
  {
    name: "sourceId",
    data_type: DataType.VarChar,
    max_length: 36,
  },
  {
    name: "knowledgeId",
    data_type: DataType.VarChar,
    max_length: 36
  },
  {
    name: "tenantId",
    data_type: DataType.VarChar,
    max_length: 36
  },
  {
    name: "createdAt",
    data_type: DataType.Int64
  },
  {
    name: "updatedAt",
    data_type: DataType.Int64
  }
];