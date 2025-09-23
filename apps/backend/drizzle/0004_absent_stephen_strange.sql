ALTER TABLE "plugin" ADD COLUMN "plugin_registry" varchar NOT NULL;--> statement-breakpoint
CREATE INDEX "plugins_plugin_registry_idx" ON "plugin" USING btree ("plugin_registry");