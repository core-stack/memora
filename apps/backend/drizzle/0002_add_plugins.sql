CREATE TABLE "knowledge_plugin" (
	"knowledge_id" varchar(36) NOT NULL,
	"plugin_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plugin" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50),
	"type" varchar(255) NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb,
	"tenant_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_plugin_unique" ON "knowledge_plugin" USING btree ("knowledge_id","plugin_id");--> statement-breakpoint
CREATE INDEX "plugins_tenant_idx" ON "plugin" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "plugins_type_idx" ON "plugin" USING btree ("type");