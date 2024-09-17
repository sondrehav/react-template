CREATE TABLE IF NOT EXISTS "users" (
	"userId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"salt" varchar NOT NULL,
	"profileUrl" varchar DEFAULT 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iODA4IiBoZWlnaHQ9IjgzOSIgdmlld0JveD0iMCAwIDgwOCA4MzkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBIODA4VjgzOUgwVjBaIiBmaWxsPSIjRDlEOUQ5Ii8+CjxwYXRoIGQ9Ik0zMTguNjExIDYxOEMzMDkuNjExIDc2NiAyOS42MTEzIDc0OCAzNi4xMTE0IDgzOUg3NzEuMTFDNzc3LjYxIDc0OCA0OTcuNjExIDc2NiA0ODguNjExIDYxOEM1MDMuNjcxIDU5Mi4yNTkgNTExLjM1NSA1NzAuODggNTIzLjYxMSA1MTkuNUM1NTkuMTExIDUwNSA1NjQuMTExIDQ0MSA1NDIuNjExIDQxMS41QzU4Mi4xMTEgMzI4LjUgNTM2LjExMSAyMDYgNDAzLjYxMSAyMDZDMjcxLjExMSAyMDYgMjI1LjExMSAzMjguNSAyNjQuNjExIDQxMS41QzI0My4xMTEgNDQxIDI0OC4xMTEgNTA1IDI4My42MTEgNTE5LjVDMjk1Ljg2OCA1NzAuODggMzAzLjU1MSA1OTIuMjU5IDMxOC42MTEgNjE4WiIgZmlsbD0iI0E0QTRBNCIvPgo8L3N2Zz4K',
	"createdAt" timestamp DEFAULT now(),
	"organizationId" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_organizations_organizationId_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("organizationId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "userEmailUniqueIndex" ON "users" USING btree ("email");