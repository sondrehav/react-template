ALTER TABLE "projects" ADD COLUMN "origin" varchar;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessionIdIndex" ON "entries" USING btree ("sessionId");