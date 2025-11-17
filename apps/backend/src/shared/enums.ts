export enum IndexStatus {
  PENDING = 'PENDING',
  INDEXING = 'INDEXING',
  INDEXED = 'INDEXED',
  ERROR = 'ERROR',
}

export enum SourceType {
  TEXT = 'TEXT',
  DOC = 'DOC',
  LINK = 'LINK',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE',
}

export enum MessageRole {
  USER = 'USER',
  AI = 'AI',
}

export enum KnowledgeStatus {
  DELETING = 'DELETING',
  DELETE_ERROR = 'DELETE_ERROR',
  OK = 'OK',
}

export enum LLMType {
  EMBEDDING = 'EMBEDDING',
  TEXT = 'TEXT',
}

export enum RoleScope {
  TENANT = 'TENANT',
  GLOBAL = 'GLOBAL',
}