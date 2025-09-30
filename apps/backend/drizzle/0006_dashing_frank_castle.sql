ALTER TABLE "sources" ALTER COLUMN "source_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."source_type";--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('TEXT', 'DOC', 'LINK', 'VIDEO', 'AUDIO', 'IMAGE');--> statement-breakpoint
ALTER TABLE "sources" ALTER COLUMN "source_type" SET DATA TYPE "public"."source_type" USING "source_type"::"public"."source_type";