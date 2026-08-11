const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const PORT = process.env.PORT || 8000;
const DB_HOST = process.env.DB_HOST || '';
const DB_PORT = process.env.DB_PORT || '5432';
const DB_NAME = process.env.DB_NAME || 'postgres';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_SSLMODE = process.env.DB_SSLMODE || 'require';
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

let SUPABASE_URL = process.env.SUPABASE_URL || '';
if (!SUPABASE_URL && DB_HOST.includes('supabase.co')) {
  const parts = DB_HOST.split('.');
  if (parts.length >= 3 && parts[0] === 'db') {
    SUPABASE_URL = `https://${parts[1]}.supabase.co`;
  }
}

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'penguin-storage';

module.exports = {
  PORT,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_SSLMODE,
  JWT_SECRET,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_STORAGE_BUCKET,
};
