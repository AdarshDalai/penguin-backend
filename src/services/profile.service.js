const pool = require('../core/config/postgres');

/**
 * Profile Service - ONLY contains direct PostgreSQL database queries against public.profiles.
 * Independent of Supabase SDK.
 */

async function insertProfile(payload) {
  const query = `
    INSERT INTO public.profiles (id, email, display_name, avatar_url, phone, bio, website, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, email, display_name, avatar_url, phone, bio, website, created_at, updated_at;
  `;
  const values = [
    payload.id,
    payload.email || null,
    payload.display_name || null,
    payload.avatar_url || null,
    payload.phone || null,
    payload.bio || null,
    payload.website || null,
    payload.updated_at || new Date().toISOString(),
  ];

  try {
    const res = await pool.query(query, values);
    return { data: res.rows[0], error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function getProfileById(id) {
  const query = `
    SELECT id, email, display_name, avatar_url, phone, bio, website, created_at, updated_at
    FROM public.profiles
    WHERE id = $1;
  `;
  try {
    const res = await pool.query(query, [id]);
    if (res.rows.length === 0) {
      return { data: null, error: { code: 'PGRST116', message: 'profile not found' } };
    }
    return { data: res.rows[0], error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function upsertProfileById(payload) {
  const query = `
    INSERT INTO public.profiles (id, email, display_name, avatar_url, phone, bio, website, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (id) DO UPDATE SET
      email = COALESCE(EXCLUDED.email, public.profiles.email),
      display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
      phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
      bio = COALESCE(EXCLUDED.bio, public.profiles.bio),
      website = COALESCE(EXCLUDED.website, public.profiles.website),
      updated_at = EXCLUDED.updated_at
    RETURNING id, email, display_name, avatar_url, phone, bio, website, created_at, updated_at;
  `;
  const values = [
    payload.id,
    payload.email || null,
    payload.display_name || null,
    payload.avatar_url || null,
    payload.phone || null,
    payload.bio || null,
    payload.website || null,
    payload.updated_at || new Date().toISOString(),
  ];

  try {
    const res = await pool.query(query, values);
    return { data: res.rows[0], error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function deleteProfileById(id) {
  const query = `
    DELETE FROM public.profiles
    WHERE id = $1
    RETURNING id;
  `;
  try {
    const res = await pool.query(query, [id]);
    return { data: res.rows, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

module.exports = {
  insertProfile,
  getProfileById,
  upsertProfileById,
  deleteProfileById,
};
