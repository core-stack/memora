ALTER TABLE "sources" ADD COLUMN "key" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX "sources_key_idx" ON "sources" USING btree ("key");