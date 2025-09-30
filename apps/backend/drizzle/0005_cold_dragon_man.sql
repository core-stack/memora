ALTER TABLE "sources" ALTER COLUMN "key" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sources" ALTER COLUMN "key" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sources" DROP COLUMN "extension";--> statement-breakpoint
ALTER TABLE "sources" DROP COLUMN "content_type";--> statement-breakpoint
ALTER TABLE "sources" DROP COLUMN "size";--> statement-breakpoint
ALTER TABLE "sources" DROP COLUMN "url";--> statement-breakpoint
ALTER TABLE "sources" DROP COLUMN "width";--> statement-breakpoint
ALTER TABLE "sources" DROP COLUMN "height";