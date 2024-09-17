ALTER TABLE "users" ALTER COLUMN "profileUrl" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "sessionId" uuid;