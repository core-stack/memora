CREATE TYPE "public"."index_status" AS ENUM('PENDING', 'INDEXING', 'INDEXED', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."knowledge_status" AS ENUM('DELETING', 'DELETE_ERROR', 'OK');--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('USER', 'AI');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('TEXT', 'DOC', 'LINK', 'VIDEO', 'AUDIO', 'IMAGE');--> statement-breakpoint
CREATE TABLE "chat" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"knowledge_id" varchar(36) NOT NULL,
	"tenant_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "knowledge_plugin" (
	"knowledge_id" varchar(36) NOT NULL,
	"plugin_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"instructions" text,
	"status" "knowledge_status" DEFAULT 'OK' NOT NULL,
	"delete_error" text,
	"file_count" integer DEFAULT 0,
	"storage" bigint DEFAULT 0,
	"tenant_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"chat_id" varchar(36) NOT NULL,
	"knowledge_id" varchar(36) NOT NULL,
	"tenant_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plugin" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50),
	"type" varchar(255) NOT NULL,
	"description" text,
	"whenUse" text,
	"config" jsonb DEFAULT '{}'::jsonb,
	"tenant_id" varchar(36) NOT NULL,
	"plugin_registry" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_tags" (
	"source_id" varchar(36) NOT NULL,
	"tag_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"path" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"original_name" varchar(255),
	"metadata" jsonb,
	"source_type" "source_type" NOT NULL,
	"index_status" "index_status" NOT NULL,
	"index_error" text,
	"memory_id" varchar(36),
	"knowledge_id" varchar(36) NOT NULL,
	"folder_id" varchar(36),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
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
CREATE TABLE "knowledge_tag" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"knowledge_id" varchar(36) NOT NULL,
	"tenant_id" varchar(36) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_knowledge_id_knowledge_id_fk" FOREIGN KEY ("knowledge_id") REFERENCES "public"."knowledge"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder" ADD CONSTRAINT "folder_knowledge_id_knowledge_id_fk" FOREIGN KEY ("knowledge_id") REFERENCES "public"."knowledge"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder" ADD CONSTRAINT "folder_parent_id_folder_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_plugin" ADD CONSTRAINT "knowledge_plugin_knowledge_id_knowledge_id_fk" FOREIGN KEY ("knowledge_id") REFERENCES "public"."knowledge"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_plugin" ADD CONSTRAINT "knowledge_plugin_plugin_id_plugin_id_fk" FOREIGN KEY ("plugin_id") REFERENCES "public"."plugin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_knowledge_id_knowledge_id_fk" FOREIGN KEY ("knowledge_id") REFERENCES "public"."knowledge"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_tags" ADD CONSTRAINT "source_tags_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_tags" ADD CONSTRAINT "source_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_knowledge_id_knowledge_id_fk" FOREIGN KEY ("knowledge_id") REFERENCES "public"."knowledge"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_folder_id_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_tag" ADD CONSTRAINT "knowledge_tag_knowledge_id_knowledge_id_fk" FOREIGN KEY ("knowledge_id") REFERENCES "public"."knowledge"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_knowledge_idx" ON "chat" USING btree ("knowledge_id");--> statement-breakpoint
CREATE INDEX "folder_tenant_idx" ON "folder" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_plugin_unique" ON "knowledge_plugin" USING btree ("knowledge_id","plugin_id");--> statement-breakpoint
CREATE INDEX "knowledge_tenant_idx" ON "knowledge" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_tenant_slug_unique" ON "knowledge" USING btree ("tenant_id","slug");--> statement-breakpoint
CREATE INDEX "messages_chat_idx" ON "message" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "messages_knowledge_idx" ON "message" USING btree ("knowledge_id");--> statement-breakpoint
CREATE INDEX "messages_tenant_idx" ON "message" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "messages_message_role_idx" ON "message" USING btree ("message_role");--> statement-breakpoint
CREATE INDEX "plugins_tenant_idx" ON "plugin" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "plugins_type_idx" ON "plugin" USING btree ("type");--> statement-breakpoint
CREATE INDEX "plugins_plugin_registry_idx" ON "plugin" USING btree ("plugin_registry");--> statement-breakpoint
CREATE UNIQUE INDEX "source_tag_unique" ON "source_tags" USING btree ("source_id","tag_id");--> statement-breakpoint
CREATE INDEX "sources_memory_idx" ON "sources" USING btree ("memory_id");--> statement-breakpoint
CREATE INDEX "sources_key_idx" ON "sources" USING btree ("key");--> statement-breakpoint
CREATE INDEX "sources_index_status_idx" ON "sources" USING btree ("index_status");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_name_tenant_unique" ON "tags" USING btree ("name","tenant_id");--> statement-breakpoint
CREATE INDEX "tags_tenant_idx" ON "tags" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "knowledge_tag_knowledge_idx" ON "knowledge_tag" USING btree ("knowledge_id");--> statement-breakpoint
CREATE INDEX "knowledge_tag_tenant_idx" ON "knowledge_tag" USING btree ("tenant_id");