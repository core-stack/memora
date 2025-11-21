import {
  CreateIndexesReq, DataType, FieldType, FunctionType, IndexType, MetricType
} from "@zilliz/milvus2-sdk-node";

export const sourceFields = (_: string, dim: number): FieldType[] => [
  {
    name: "id",
    data_type: DataType.VarChar,
    max_length: 36,
    is_primary_key: true
  },
  {
    name: "seqId",
    data_type: DataType.Int32
  },
  {
    name: "dense",
    data_type: DataType.FloatVector,
    dim
  },
  {
    name: "sparse",
    data_type: DataType.SparseFloatVector
  },
  {
    name: "content",
    data_type: DataType.VarChar,
    max_length: 2048,
    enable_analyzer: true,
    enable_match: true,
    analyzer_params: {
      "tokenizer": "standard",
      "filter": [ "asciifolding", "lowercase" ]
    }
  },
  {
    name: "sourceId",
    data_type: DataType.VarChar,
    max_length: 36
  },
  {
    name: "sourceType",
    data_type: DataType.VarChar,
    max_length: 36
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
    data_type: DataType.Int64,
    nullable: true
  },
  {
    name: "metadata",
    data_type: DataType.JSON,
    nullable: true
  }
];

export const sourceIndexSchema = (collection_name: string): CreateIndexesReq => {
  return [
    {
      collection_name,
      field_name: "dense",
      index_name: "dense_idx",
      extra_params: {
        index_type: "IVF_FLAT",
        metric_type: MetricType.IP,
        params: JSON.stringify({ nlist: 128 })
      }
    },
    {
      collection_name,
      field_name: "sparse",
      metric_type: MetricType.BM25,
      index_type: IndexType.SPARSE_INVERTED_INDEX,
      params: {
        "inverted_index_algo": "DAAT_MAXSCORE"
      }
    }
  ];
};

export const sourceFunctions = [
  {
    name: "bm25_emb",
    description: "bm25 function",
    type: FunctionType.BM25,
    input_field_names: [ "content" ],
    output_field_names: [ "sparse" ],
    params: {}
  }
];

