import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Lazy singleton so importing this module at build time (when no env vars are
// available) doesn't crash. Pages and routes that actually call the database
// get an initialized client on first use.

type Db = NeonHttpDatabase<typeof schema>;

let _db: Db | null = null;
let _sql: NeonQueryFunction<false, false> | null = null;

function init(): Db {
  const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'Database connection string missing. Expected POSTGRES_URL (Vercel Postgres) or DATABASE_URL.',
    );
  }
  _sql = neon(url);
  _db = drizzle(_sql, { schema });
  return _db;
}

export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    if (!_db) init();
    return Reflect.get(_db as object, prop, receiver);
  },
}) as Db;

export { schema };
