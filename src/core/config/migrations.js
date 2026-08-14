const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { execSync } = require('child_process');
const path = require('path');
const pool = require('./postgres');

async function runMigrations() {
  const db = drizzle(pool);
  const migrationsFolder = path.resolve(__dirname, '../../../migrations');

  try {
    console.log('[penguin] Auto-generating schema revisions via Drizzle-Kit...');
    try {
      execSync('npx drizzle-kit generate', { stdio: 'inherit' });
    } catch (genErr) {
      console.warn('[penguin] Warning: Drizzle-Kit auto-generation skipped or completed with notices:', genErr.message);
    }

    console.log('[penguin] Applying database migrations...');
    await migrate(db, { migrationsFolder });
    console.log('[penguin] Database migrations executed successfully');
  } catch (err) {
    console.error('[penguin] Database migration error:', err);
    throw err;
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      pool.end();
      process.exit(0);
    })
    .catch(() => {
      pool.end();
      process.exit(1);
    });
}

module.exports = runMigrations;
