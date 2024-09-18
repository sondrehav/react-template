import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const defaultImage =
  'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NCIgaGVpZ2h0PSI0MSIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDU0IDQxIj48cGF0aCBmaWxsPSIjMkEyRTRFIiBkPSJNNTQgMS41YTEuNSAxLjUgMCAxIDEtMyAwIDEuNSAxLjUgMCAwIDEgMyAwWiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMyQTJFNEUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEzLjc1IDQwLjc5NEM2LjE1NiA0MC43OTQgMCAzNC42MzggMCAyNy4wNDRWMWg1djI2LjA0NGE4Ljc1IDguNzUgMCAwIDAgOC43NSA4Ljc1YzQuODkzIDAgOC43NS0zLjc3MSA4Ljc1LTguNTQ0aDV2Ny41YTEuMjUgMS4yNSAwIDAgMCAyLjUgMHYtOC44NzVhNi4yNSA2LjI1IDAgMCAxLTcuNS02LjEyNVY3LjI1YTYuMjUgNi4yNSAwIDEgMSAxMi41IDB2MjcuNWExLjI1IDEuMjUgMCAxIDAgMi41IDBWNy4yNWE2LjI1IDYuMjUgMCAxIDEgMTIuNSAwdjI3LjVhNi4yNSA2LjI1IDAgMCAxLTEwIDVBNi4yMjIgNi4yMjIgMCAwIDEgMzYuMjUgNDFhNi4yMjIgNi4yMjIgMCAwIDEtMy43NS0xLjI1IDYuMjUxIDYuMjUxIDAgMCAxLTkuNDY2LTIuNDdjLTIuNDU2IDIuMTk3LTUuNzIzIDMuNTE0LTkuMjg0IDMuNTE0Wm0zMC00Ljc5NGMtLjY5IDAtMS4yNS0uNTYtMS4yNS0xLjI1VjcuMjVhMS4yNSAxLjI1IDAgMSAxIDIuNSAwdjI3LjVjMCAuNjktLjU2IDEuMjUtMS4yNSAxLjI1Wk0zMCAxOS43NWExLjI1IDEuMjUgMCAwIDEtMi41IDBWNy4yNWExLjI1IDEuMjUgMCAxIDEgMi41IDB2MTIuNVoiIGNsaXAtcnVsZT0iZXZlbm9kZCI+PC9wYXRoPjxwYXRoIGZpbGw9IiMyQTJFNEUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNSAyNy4yNWE2LjI1IDYuMjUgMCAxIDAgMTIuNSAwdi0yMGE2LjI1IDYuMjUgMCAxIDAtMTIuNSAwdjIwWm02LjI1IDEuMjVjLS42OSAwLTEuMjUtLjU2LTEuMjUtMS4yNXYtMjBhMS4yNSAxLjI1IDAgMSAxIDIuNSAwdjIwYzAgLjY5LS41NiAxLjI1LTEuMjUgMS4yNVoiIGNsaXAtcnVsZT0iZXZlbm9kZCI+PC9wYXRoPjwvc3ZnPg==';

const defaultProfileImage =
  'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iODA4IiBoZWlnaHQ9IjgzOSIgdmlld0JveD0iMCAwIDgwOCA4MzkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBIODA4VjgzOUgwVjBaIiBmaWxsPSIjRDlEOUQ5Ii8+CjxwYXRoIGQ9Ik0zMTguNjExIDYxOEMzMDkuNjExIDc2NiAyOS42MTEzIDc0OCAzNi4xMTE0IDgzOUg3NzEuMTFDNzc3LjYxIDc0OCA0OTcuNjExIDc2NiA0ODguNjExIDYxOEM1MDMuNjcxIDU5Mi4yNTkgNTExLjM1NSA1NzAuODggNTIzLjYxMSA1MTkuNUM1NTkuMTExIDUwNSA1NjQuMTExIDQ0MSA1NDIuNjExIDQxMS41QzU4Mi4xMTEgMzI4LjUgNTM2LjExMSAyMDYgNDAzLjYxMSAyMDZDMjcxLjExMSAyMDYgMjI1LjExMSAzMjguNSAyNjQuNjExIDQxMS41QzI0My4xMTEgNDQxIDI0OC4xMTEgNTA1IDI4My42MTEgNTE5LjVDMjk1Ljg2OCA1NzAuODggMzAzLjU1MSA1OTIuMjU5IDMxOC42MTEgNjE4WiIgZmlsbD0iI0E0QTRBNCIvPgo8L3N2Zz4K';

export const usersTable = pgTable(
  'users',
  {
    userId: uuid('userId').primaryKey().defaultRandom(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull(),
    password: varchar('password').notNull(),
    salt: varchar('salt').notNull(),
    profileUrl: varchar('profileUrl').notNull().default(defaultProfileImage),
    createdAt: timestamp('createdAt').defaultNow(),
    organizationId: uuid('organizationId').references(
      () => organizationsTable.organizationId,
    ),
  },
  (users) => {
    return {
      userEmailUniqueIndex: uniqueIndex('userEmailUniqueIndex').on(users.email),
    };
  },
);

export const organizationsTable = pgTable('organizations', {
  organizationId: uuid('organizationId').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  logoUrl: varchar('logoUrl').default(defaultImage),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const projectsTable = pgTable(
  'projects',
  {
    projectId: uuid('projectId').primaryKey().defaultRandom(),
    organizationId: uuid('organizationId')
      .references(() => organizationsTable.organizationId)
      .notNull(),
    name: varchar('name').notNull(),
    slug: varchar('slug').notNull(),
    logoUrl: varchar('logoUrl').default(defaultImage),
    createdAt: timestamp('createdAt').defaultNow(),
    origin: varchar('origin'),
  },
  (projects) => {
    return {
      slugIndex: uniqueIndex('projectSlugUniqueIndex').on(
        projects.slug,
        projects.organizationId,
      ),
    };
  },
);

export const entryTypeEnum = pgEnum('entryType', ['pageView', 'load', 'error']);

export const entriesTable = pgTable(
  'entries',
  {
    entryId: uuid('entryId').primaryKey().defaultRandom(),
    projectId: uuid('projectId')
      .references(() => projectsTable.projectId)
      .notNull(),
    type: entryTypeEnum('entryType').notNull(),
    data: jsonb('data').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    sessionId: uuid('sessionId'),
  },
  (projects) => {
    return {
      projectIdTypeIndex: index('projectIdTypeIndex').on(
        projects.projectId,
        projects.type,
      ),
      projectIdCreatedAtIndex: index('projectIdCreatedAtIndex').on(
        projects.projectId,
        projects.createdAt,
      ),
      sessionIdIndex: index('sessionIdIndex').on(projects.sessionId),
    };
  },
);
