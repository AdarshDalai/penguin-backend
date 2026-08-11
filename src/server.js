const app = require('./app');
const { PORT, SUPABASE_URL } = require('./core/config/env');
const runMigrations = require('./core/config/migrations');

async function startServer() {
  try {
    // Run direct PostgreSQL migrations automatically
    await runMigrations();

    app.listen(PORT, () => {
      console.log(`[penguin] Express backend connected to Supabase (${SUPABASE_URL})`);
      console.log(`[penguin] starting Penguin Express Server on :${PORT}`);
    });
  } catch (err) {
    console.error('[penguin] Failed to start server due to migration error:', err.message);
    process.exit(1);
  }
}

startServer();
