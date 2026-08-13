#!/usr/bin/env node

/**
 * Script to assign admin privileges to a user in Supabase auth.users table.
 * Usage: node scripts/make-admin.js <email>
 */

const pool = require('../src/core/config/postgres');

const targetEmail = process.argv[2] || 'adarshkumar.dalai@gmail.com';

async function makeAdmin() {
  try {
    console.log(`[penguin] Granting admin privileges to: ${targetEmail}`);

    const res = await pool.query(
      `
      UPDATE auth.users
      SET raw_app_meta_data = jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{roles}',
        '["admin"]'::jsonb
      ),
      is_super_admin = true
      WHERE email = $1
      RETURNING id, email, raw_app_meta_data, is_super_admin;
      `,
      [targetEmail]
    );

    if (res.rowCount === 0) {
      console.error(`[penguin] Error: User with email "${targetEmail}" was not found.`);
      process.exit(1);
    }

    console.log('[penguin] Success! Granted admin privileges to user:');
    console.log(res.rows[0]);
  } catch (err) {
    console.error('[penguin] Error granting admin privileges:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

makeAdmin();
