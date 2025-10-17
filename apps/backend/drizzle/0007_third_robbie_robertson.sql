CREATE TABLE "knowledge_tag" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"knowledge_id" varchar(36) NOT NULL,
	"tenant_id" varchar(36) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "knowledge" ADD COLUMN "instructions" text;--> statement-breakpoint
ALTER TABLE "knowledge" ADD COLUMN "file_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "knowledge" ADD COLUMN "storage" bigint DEFAULT 0;--> statement-breakpoint
CREATE INDEX "knowledge_tag_knowledge_idx" ON "knowledge_tag" USING btree ("knowledge_id");--> statement-breakpoint
CREATE INDEX "knowledge_tag_tenant_idx" ON "knowledge_tag" USING btree ("tenant_id");