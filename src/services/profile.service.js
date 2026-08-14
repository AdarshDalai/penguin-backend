const pool = require('../core/config/postgres');

/**
 * Profile Service - ONLY contains direct PostgreSQL database queries against public.profiles.
 * Independent of Supabase SDK.
 */

async function insertProfile(payload) {
  const query = `
    INSERT INTO public.profiles (id, handle, email, display_name, avatar_url, phone, bio, website, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, handle, email, display_name, avatar_url, phone, bio, website, created_at, updated_at;
  `;
  const values = [
    payload.id,
    payload.handle,
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
    SELECT id, handle, email, display_name, avatar_url, phone, bio, website, created_at, updated_at
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
    INSERT INTO public.profiles (id, handle, email, display_name, avatar_url, phone, bio, website, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (id, handle) DO UPDATE SET
      email = COALESCE(EXCLUDED.email, public.profiles.email),
      display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
      phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
      bio = COALESCE(EXCLUDED.bio, public.profiles.bio),
      website = COALESCE(EXCLUDED.website, public.profiles.website),
      updated_at = EXCLUDED.updated_at
    RETURNING id, handle, email, display_name, avatar_url, phone, bio, website, created_at, updated_at;
  `;
  const values = [
    payload.id,
    payload.handle,
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

async function listProfiles(options = {}) {
  const { search, field_name, field_value, skip = 0, limit = 50 } = options;
  const whereClauses = [];
  const queryParams = [];

  // Allowed columns for specific field filtering to prevent SQL injection
  const allowedFields = ['id', 'handle', 'email', 'display_name', 'avatar_url', 'phone', 'bio', 'website'];

  if (field_name && field_value !== undefined && field_value !== null && field_value !== '') {
    if (!allowedFields.includes(field_name)) {
      return {
        data: null,
        error: { message: `Invalid field_name '${field_name}'. Allowed fields: ${allowedFields.join(', ')}` },
      };
    }
    queryParams.push(`%${field_value}%`);
    const paramIdx = queryParams.length;
    whereClauses.push(`${field_name} ILIKE $${paramIdx}`);
  }

  if (search && search.trim() !== '') {
    queryParams.push(`%${search.trim()}%`);
    const paramIdx = queryParams.length;
    whereClauses.push(`(
      handle ILIKE $${paramIdx} OR
      display_name ILIKE $${paramIdx} OR
      email ILIKE $${paramIdx} OR
      phone ILIKE $${paramIdx} OR
      bio ILIKE $${paramIdx}
    )`);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Get total count matching search criteria
  const countQuery = `SELECT COUNT(*) AS total FROM public.profiles ${whereSql};`;
  
  // Data query with offset/limit (skip/limit)
  const dataQueryParams = [...queryParams];
  dataQueryParams.push(parseInt(limit, 10));
  const limitIdx = dataQueryParams.length;
  dataQueryParams.push(parseInt(skip, 10));
  const skipIdx = dataQueryParams.length;

  const dataQuery = `
    SELECT id, handle, email, display_name, avatar_url, phone, bio, website, created_at, updated_at
    FROM public.profiles
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT $${limitIdx} OFFSET $${skipIdx};
  `;

  try {
    const countRes = await pool.query(countQuery, queryParams);
    const total = parseInt(countRes.rows[0].total, 10);

    const dataRes = await pool.query(dataQuery, dataQueryParams);

    return {
      data: {
        profiles: dataRes.rows,
        total,
        skip: parseInt(skip, 10),
        limit: parseInt(limit, 10),
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

async function searchProfilesByHandleRegex(options = {}) {
  const { pattern = '', skip = 0, limit = 50 } = options;
  const whereClauses = [];
  const queryParams = [];

  if (pattern && pattern.trim() !== '') {
    queryParams.push(pattern.trim());
    const paramIdx = queryParams.length;
    whereClauses.push(`handle ~* $${paramIdx}`);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const countQuery = `SELECT COUNT(*) AS total FROM public.profiles ${whereSql};`;

  const dataQueryParams = [...queryParams];
  dataQueryParams.push(parseInt(limit, 10));
  const limitIdx = dataQueryParams.length;
  dataQueryParams.push(parseInt(skip, 10));
  const skipIdx = dataQueryParams.length;

  const dataQuery = `
    SELECT id, handle, email, display_name, avatar_url, phone, bio, website, created_at, updated_at
    FROM public.profiles
    ${whereSql}
    ORDER BY handle ASC
    LIMIT $${limitIdx} OFFSET $${skipIdx};
  `;

  try {
    const countRes = await pool.query(countQuery, queryParams);
    const total = parseInt(countRes.rows[0].total, 10);

    const dataRes = await pool.query(dataQuery, dataQueryParams);

    return {
      data: {
        profiles: dataRes.rows,
        total,
        skip: parseInt(skip, 10),
        limit: parseInt(limit, 10),
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

module.exports = {
  insertProfile,
  getProfileById,
  listProfiles,
  searchProfilesByHandleRegex,
  upsertProfileById,
  deleteProfileById,
};
