import 'dotenv/config';
import path from 'node:path';
import { db } from '../db/db';
import { migrate } from 'drizzle-orm/libsql/migrator';

(async () => {
  await migrate(db, {
    migrationsFolder: path.resolve(import.meta.dirname, '../migrations'),
  });
})();
