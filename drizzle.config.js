const { defineConfig } = require('drizzle-kit');
const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_SSLMODE,
} = require('./src/core/config/env');

module.exports = defineConfig({
  schema: './src/models/*.model.js',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: DB_HOST,
    port: parseInt(DB_PORT, 10),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ssl: DB_SSLMODE === 'require' || DB_SSLMODE === 'true' ? { rejectUnauthorized: false } : false,
  },
});
