CREATE TYPE "public"."index_status" AS ENUM('PENDING', 'INDEXING', 'INDEXED', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('TEXT', 'FILE', 'LINK', 'VIDEO', 'AUDIO', 'IMAGE');--> statement-breakpoint
CREATE TABLE "folder" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"knowledge_id" varchar(36) NOT NULL,
	"name" varchar(100) NOT NULL,
	"root" boolean,
	"parent_id" varchar(36),
	"tenant_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"original_name" varchar(255),
	"extension" varchar(20),
	"content_type" varchar(100),
	"size" integer,
	"url" varchar(2048),
	"width" integer,
	"height" integer,
	"metadata" jsonb,
	"source_type" "source_type" NOT NULL,
	"index_status" "index_status" NOT NULL,
	"index_error" text,
	"memory_id" varchar(36),
	"knowledge_id" varchar(36) NOT NULL,
	"folder_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_tags" (
	"source_id" varchar(36) NOT NULL,
	"tag_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"tenant_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"tenant_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "folder_tenant_idx" ON "folder" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "sources_memory_idx" ON "sources" USING btree ("memory_id");--> statement-breakpoint
CREATE INDEX "sources_index_status_idx" ON "sources" USING btree ("index_status");--> statement-breakpoint
CREATE UNIQUE INDEX "source_tag_unique" ON "source_tags" USING btree ("source_id","tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_name_tenant_unique" ON "tags" USING btree ("name","tenant_id");--> statement-breakpoint
CREATE INDEX "tags_tenant_idx" ON "tags" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "knowledge_tenant_idx" ON "knowledge" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_tenant_slug_unique" ON "knowledge" USING btree ("tenant_id","slug");