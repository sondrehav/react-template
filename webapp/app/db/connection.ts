import { drizzle } from 'drizzle-orm/node-postgres';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import pkg from 'pg';
const { Client } = pkg;

const tryParseInt = (value?: string) => {
  if (!value) return null;
  const v = parseInt(value);
  if (Number.isNaN(v)) return null;
  return v;
};

let connection: NodePgDatabase | null = null;
const getDBConnection = (async () => {
  if (connection) {
    return connection;
  }
  const client = new Client({
    port: tryParseInt(process.env['DB_PORT']) ?? 4677,
    host: process.env['DB_HOST'] ?? 'localhost',
    user: process.env['DB_USER'] ?? 'username',
    password: process.env['DB_PASSWORD'] ?? 'password',
    database: process.env['DB_DATABASE'] ?? 'default_database',
  });
  await client.connect();
  connection = drizzle(client);
  await migrate(connection, { migrationsFolder: './drizzle' });
  return connection;
})();

export default getDBConnection;
