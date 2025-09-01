-- CreateEnum
CREATE TYPE "public"."IndexStatus" AS ENUM ('PENDING', 'INDEXING', 'INDEXED', 'ERROR');

-- CreateEnum
CREATE TYPE "public"."SourceType" AS ENUM ('TEXT', 'FILE', 'LINK', 'VIDEO', 'AUDIO', 'IMAGE');

-- CreateTable
CREATE TABLE "public"."KnowledgeBase" (
    "id" CHAR(36) NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tenant_id" CHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KnowledgeBaseFolder" (
    "id" CHAR(36) NOT NULL,
    "knowledge_base_id" CHAR(36) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "root" BOOLEAN,
    "parent_id" CHAR(36),
    "tenant_id" CHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeBaseFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sources" (
    "id" CHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "original_name" TEXT,
    "extension" TEXT,
    "content_type" TEXT,
    "size" INTEGER,
    "url" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "metadata" JSONB,
    "source_type" "public"."SourceType" NOT NULL,
    "index_status" "public"."IndexStatus" NOT NULL,
    "index_error" TEXT,
    "memory_id" TEXT,
    "knowledge_base_id" CHAR(36) NOT NULL,
    "knowledge_base_folder_id" CHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."file_tags" (
    "file_id" CHAR(36) NOT NULL,
    "tag_id" CHAR(36) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" CHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnowledgeBase_tenant_id_idx" ON "public"."KnowledgeBase"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeBase_tenant_id_slug_key" ON "public"."KnowledgeBase"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "KnowledgeBaseFolder_tenant_id_idx" ON "public"."KnowledgeBaseFolder"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeBaseFolder_tenant_id_knowledge_base_id_slug_key" ON "public"."KnowledgeBaseFolder"("tenant_id", "knowledge_base_id", "slug");

-- CreateIndex
CREATE INDEX "sources_memory_id_idx" ON "public"."sources"("memory_id");

-- CreateIndex
CREATE INDEX "sources_index_status_idx" ON "public"."sources"("index_status");

-- CreateIndex
CREATE UNIQUE INDEX "file_tags_file_id_tag_id_key" ON "public"."file_tags"("file_id", "tag_id");

-- CreateIndex
CREATE INDEX "tags_tenant_id_idx" ON "public"."tags"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_tenant_id_key" ON "public"."tags"("name", "tenant_id");

-- AddForeignKey
ALTER TABLE "public"."KnowledgeBaseFolder" ADD CONSTRAINT "KnowledgeBaseFolder_knowledge_base_id_fkey" FOREIGN KEY ("knowledge_base_id") REFERENCES "public"."KnowledgeBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KnowledgeBaseFolder" ADD CONSTRAINT "KnowledgeBaseFolder_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."KnowledgeBaseFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sources" ADD CONSTRAINT "sources_knowledge_base_id_fkey" FOREIGN KEY ("knowledge_base_id") REFERENCES "public"."KnowledgeBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sources" ADD CONSTRAINT "sources_knowledge_base_folder_id_fkey" FOREIGN KEY ("knowledge_base_folder_id") REFERENCES "public"."KnowledgeBaseFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_tags" ADD CONSTRAINT "file_tags_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_tags" ADD CONSTRAINT "file_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
