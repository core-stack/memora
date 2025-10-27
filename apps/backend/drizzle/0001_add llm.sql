CREATE TYPE "public"."llm_type" AS ENUM('EMBEDDING', 'TEXT');--> statement-breakpoint
CREATE TABLE "knowledge_llm" (
	"knowledge_id" varchar(36) NOT NULL,
	"llm_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "llm" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb,
	"type" "llm_type" NOT NULL,
	"tenant_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "knowledge_llm" ADD CONSTRAINT "knowledge_llm_knowledge_id_knowledge_id_fk" FOREIGN KEY ("knowledge_id") REFERENCES "public"."knowledge"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_llm" ADD CONSTRAINT "knowledge_llm_llm_id_llm_id_fk" FOREIGN KEY ("llm_id") REFERENCES "public"."llm"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_llm_unique" ON "knowledge_llm" USING btree ("knowledge_id","llm_id");--> statement-breakpoint
CREATE INDEX "llms_tenant_idx" ON "llm" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "llms_name_tenant_unique" ON "llm" USING btree ("name","tenant_id");