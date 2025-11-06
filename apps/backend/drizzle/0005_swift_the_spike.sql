DROP INDEX "roles_key_scope_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "roles_key_scope_tenant_id_unique" ON "roles" USING btree ("key","scope","tenant_id");