import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// Prefer the non-pooled (direct) connection for migrations. pgbouncer can
// interfere with transactional DDL. Vercel-Neon (modern) injects
// DATABASE_URL_UNPOOLED; older Vercel Postgres injected POSTGRES_URL_NON_POOLING.
const url =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    'drizzle.config: no database URL found. Expected DATABASE_URL_UNPOOLED (Vercel-Neon) ' +
      'or POSTGRES_URL_NON_POOLING. Copy .env.example to .env.local for local dev; ' +
      'on Vercel the Neon integration injects these automatically.',
  );
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
