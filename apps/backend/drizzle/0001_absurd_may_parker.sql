CREATE TYPE "public"."message_role" AS ENUM('USER', 'AI');--> statement-breakpoint
CREATE TABLE "chat" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"knowledge_id" varchar(36) NOT NULL,
	"tenant_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_role" "message_role" NOT NULL,
	"content" varchar(50) NOT NULL,
	"chat_id" varchar(36) NOT NULL,
	"knowledge_id" varchar(36) NOT NULL,
	"tenant_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "chat_knowledge_idx" ON "chat" USING btree ("knowledge_id");--> statement-breakpoint
CREATE INDEX "messages_chat_idx" ON "message" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "messages_knowledge_idx" ON "message" USING btree ("knowledge_id");--> statement-breakpoint
CREATE INDEX "messages_tenant_idx" ON "message" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "messages_message_role_idx" ON "message" USING btree ("message_role");